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

    // KIE.AI API configuration
    const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
    const KIE_AI_API_URL = 'https://api.kie.ai/v1/image-to-image';

    if (!KIE_AI_API_KEY) {
      console.error('KIE_AI_API_KEY is not configured');
      // For now, return mock response for testing
      return NextResponse.json({
        resultUrl: '/mock-result.jpg',
        message: 'Mock response - KIE.AI API key not configured',
      });
    }

    // Convert File to Buffer for KIE.AI
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Prepare KIE.AI API request
    const kieFormData = new FormData();

    // Create blob from buffer
    const blob = new Blob([buffer], { type: imageFile.type });
    kieFormData.append('image', blob, imageFile.name);
    kieFormData.append('prompt', prompt);
    kieFormData.append('strength', '0.8'); // How much to transform (0-1)
    kieFormData.append('guidance_scale', '7.5'); // How closely to follow prompt
    kieFormData.append('num_inference_steps', '50'); // Quality vs speed

    // Add style-specific parameters
    if (style === 'sport') {
      kieFormData.append('negative_prompt', 'blurry, low quality, distorted, vintage, old-fashioned');
    } else if (style === 'classic') {
      kieFormData.append('negative_prompt', 'blurry, low quality, distorted, modern, aggressive');
    }

    console.log('Calling KIE.AI API with prompt:', prompt);

    // Call KIE.AI API
    const response = await fetch(KIE_AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIE_AI_API_KEY}`,
      },
      body: kieFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('KIE.AI API error:', errorText);
      throw new Error(`KIE.AI API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    // KIE.AI typically returns image URL or base64
    const resultUrl = result.image_url || result.output_url || result.url;

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
    console.error('Image tuning error:', error);
    return NextResponse.json(
      {
        error: 'Image tuning failed',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
