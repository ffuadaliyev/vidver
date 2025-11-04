import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check token balance (5 tokens required for image modification)
    const tokenWallet = await prisma.tokenWallet.findUnique({
      where: { userId },
    });

    if (!tokenWallet || tokenWallet.balance < 5) {
      return NextResponse.json(
        { error: 'Insufficient tokens', message: 'You need at least 5 tokens for image modification' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const style = formData.get('style') as string;
    const tuning = formData.get('tuning') as string;
    const color = formData.get('color') as string;

    if (!imageFile || !prompt) {
      return NextResponse.json({ error: 'Image and prompt are required' }, { status: 400 });
    }

    // KIE.AI API configuration - FLUX Kontext API for image editing
    const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;

    if (!KIE_AI_API_KEY) {
      console.error('KIE_AI_API_KEY is not configured');
      return NextResponse.json({
        error: 'API key not configured',
        message: 'KIE.AI API key is not configured',
      }, { status: 500 });
    }

    // Convert File to buffer and upload to temporary public URL
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Uploading image to temporary storage...');
    console.log('Image size:', imageFile.size, 'bytes');

    // Upload to tmpfiles.org for temporary public URL
    const uploadFormData = new FormData();
    const blob = new Blob([buffer], { type: imageFile.type });
    uploadFormData.append('file', blob, imageFile.name);

    const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image to temporary storage');
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload result:', uploadResult);

    // tmpfiles.org returns: {"status":"success","data":{"url":"https://tmpfiles.org/abc123"}}
    // We need to convert to direct link: https://tmpfiles.org/dl/abc123
    let imageUrl = uploadResult.data.url;
    if (imageUrl.includes('tmpfiles.org/')) {
      imageUrl = imageUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
    }

    console.log('Temporary image URL:', imageUrl);
    console.log('Calling KIE.AI FLUX Kontext API');
    console.log('Prompt:', prompt);

    // Prepare request body for FLUX Kontext API
    const requestBody = {
      prompt: prompt,
      inputImage: imageUrl, // Public URL from tmpfiles.org
      aspectRatio: '16:9',
      outputFormat: 'jpeg',
      safetyTolerance: 2, // 0-2 for editing mode
    };

    // Call KIE.AI FLUX Kontext API
    const response = await fetch('https://api.kie.ai/api/v1/flux/kontext/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('KIE.AI API error:', response.status, errorText);
      throw new Error(`KIE.AI API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('KIE.AI API response:', result);

    // FLUX Kontext API returns taskId for async processing
    if (result.code === 200 && result.data && result.data.taskId) {
      // Poll for result
      const taskId = result.data.taskId;
      let taskResult;
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds max wait

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        const statusResponse = await fetch(
          `https://api.kie.ai/api/v1/flux/kontext/record-info?taskId=${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${KIE_AI_API_KEY}`,
            },
          }
        );

        if (!statusResponse.ok) {
          console.error('Error checking task status:', statusResponse.status);
          attempts++;
          continue;
        }

        taskResult = await statusResponse.json();
        console.log('Task status response:', taskResult, 'Attempt:', attempts + 1);

        // KIE.AI response format: {code: 200, msg: "success", data: {successFlag: 1, response: {resultImageUrl: "..."}}}
        if (taskResult.code === 200 && taskResult.data) {
          // Check if task is completed (successFlag: 1)
          if (taskResult.data.successFlag === 1 && taskResult.data.response) {
            const resultUrl = taskResult.data.response.resultImageUrl;

            if (resultUrl) {
              console.log('Image generation completed:', resultUrl);

              // Save to database and deduct tokens
              try {
                // Create input asset
                const inputAsset = await prisma.asset.create({
                  data: {
                    userId,
                    type: 'IMAGE',
                    side: 'FRONT',
                    url: imageUrl, // The tmpfiles.org URL
                    filename: imageFile.name,
                    mimeType: imageFile.type,
                    size: imageFile.size,
                    width: null,
                    height: null,
                  },
                });

                // Create output asset
                const outputAsset = await prisma.asset.create({
                  data: {
                    userId,
                    type: 'IMAGE',
                    side: 'FRONT',
                    url: resultUrl,
                    filename: `tuned_${imageFile.name}`,
                    mimeType: 'image/jpeg',
                    size: 0, // We don't know the size yet
                    width: null,
                    height: null,
                    meta: JSON.stringify({ style, tuning, color }),
                  },
                });

                // Create job record
                const job = await prisma.job.create({
                  data: {
                    userId,
                    kind: 'IMAGE_MODIFY',
                    status: 'DONE',
                    costTokens: 5,
                    completedAt: new Date(),
                    inputAssets: {
                      connect: { id: inputAsset.id },
                    },
                    outputAssets: {
                      connect: { id: outputAsset.id },
                    },
                  },
                });

                // Deduct tokens in a transaction
                await prisma.$transaction([
                  // Update token wallet
                  prisma.tokenWallet.update({
                    where: { userId },
                    data: {
                      balance: { decrement: 5 },
                      totalSpent: { increment: 5 },
                    },
                  }),
                  // Create token transaction
                  prisma.tokenTransaction.create({
                    data: {
                      userId,
                      jobId: job.id,
                      amount: -5,
                      type: 'IMAGE_MODIFY',
                      description: `AI image tuning: ${style} style`,
                      balanceBefore: tokenWallet.balance,
                      balanceAfter: tokenWallet.balance - 5,
                    },
                  }),
                ]);

                console.log('Database updated successfully. Job ID:', job.id);
              } catch (dbError) {
                console.error('Error saving to database:', dbError);
                // Continue even if database save fails
              }

              return NextResponse.json({
                success: true,
                resultUrl,
                prompt,
                metadata: {
                  style,
                  tuning,
                  color,
                  taskId,
                },
              });
            }
          } else if (taskResult.data.errorCode || taskResult.data.errorMessage) {
            throw new Error(`Image generation failed: ${taskResult.data.errorMessage || taskResult.data.errorCode}`);
          }
        }

        attempts++;
      }

      throw new Error('Image generation timed out');
    }

    // Fallback if no taskId or immediate result
    if (result.code !== 200 || !result.data) {
      console.error('Unexpected KIE.AI response:', result);
      throw new Error(result.msg || 'No result from KIE.AI');
    }

    const resultUrl = result.data.images?.[0] || result.data.image_url;

    if (!resultUrl) {
      console.error('No image URL in KIE.AI response:', result);
      throw new Error('No result image received from KIE.AI');
    }

    return NextResponse.json({
      success: true,
      resultUrl,
      prompt,
      metadata: {
        style,
        tuning,
        color,
      },
    });

  } catch (error: any) {
    console.error('=== IMAGE TUNING ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        error: 'Image tuning failed',
        message: error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? {
          name: error.name,
          stack: error.stack,
        } : undefined,
      },
      { status: 500 }
    );
  }
}
