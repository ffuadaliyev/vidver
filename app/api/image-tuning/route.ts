import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const KIE_AI_API_URL = 'https://api.kie.ai/api/v1/flux/kontext/generate';

    if (!KIE_AI_API_KEY) {
      console.error('KIE_AI_API_KEY is not configured');
      return NextResponse.json({
        error: 'API key not configured',
        message: 'KIE.AI API key is not configured',
      }, { status: 500 });
    }

    // Convert File to base64 data URL for KIE.AI
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    console.log('Calling KIE.AI FLUX Kontext API');
    console.log('Prompt:', prompt);
    console.log('Image size:', imageFile.size, 'bytes');

    // Prepare request body for FLUX Kontext API
    const requestBody = {
      prompt: prompt,
      inputImage: dataUrl, // Base64 data URL
      aspectRatio: '16:9',
      outputFormat: 'jpeg',
      safetyTolerance: 2, // 0-2 for editing mode
    };

    // Call KIE.AI FLUX Kontext API
    const response = await fetch(KIE_AI_API_URL, {
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
    if (result.taskId) {
      // Poll for result
      const taskId = result.taskId;
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
        console.log('Task status:', taskResult.status, 'Attempt:', attempts + 1);

        if (taskResult.status === 'completed' && taskResult.images && taskResult.images.length > 0) {
          const resultUrl = taskResult.images[0];
          console.log('Image generation completed:', resultUrl);

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
        } else if (taskResult.status === 'failed') {
          throw new Error('Image generation failed');
        }

        attempts++;
      }

      throw new Error('Image generation timed out');
    }

    // Fallback if no taskId
    const resultUrl = result.images?.[0] || result.image_url || result.output_url || result.url;

    if (!resultUrl) {
      console.error('No image URL in KIE.AI response:', result);
      throw new Error('No result image received from KIE.AI');
    }

    // TODO: Save to database (Job, Asset)
    // For now, just return the result

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
