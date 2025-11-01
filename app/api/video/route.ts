import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TOKEN_COST, JOB_STATUS, JOB_KIND, ASSET_TYPE } from '@/lib/constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { assetId, effectKey } = body;

    if (!assetId || !effectKey) {
      return NextResponse.json(
        { error: 'Şəkil və effekt tələb olunur' },
        { status: 400 }
      );
    }

    // Check token balance
    const wallet = await prisma.tokenWallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < TOKEN_COST.VIDEO_GENERATE) {
      return NextResponse.json(
        { error: 'Kifayət qədər token yoxdur' },
        { status: 402 }
      );
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        userId,
        kind: JOB_KIND.VIDEO,
        presets: JSON.stringify([effectKey]),
        status: JOB_STATUS.PROCESSING,
        costTokens: TOKEN_COST.VIDEO_GENERATE,
        inputAssets: {
          connect: { id: assetId },
        },
      },
    });

    // Simulate AI video generation (5 seconds)
    await delay(5000);

    // Create mock video output
    const videoAsset = await prisma.asset.create({
      data: {
        userId,
        type: ASSET_TYPE.VIDEO,
        url: `/demo/videos/${effectKey}.mp4`,
        filename: `${effectKey}-output.mp4`,
        mimeType: 'video/mp4',
        size: 5024000, // Mock 5MB video
        meta: JSON.stringify({
          generated: true,
          jobId: job.id,
          effect: effectKey,
          duration: 10,
        }),
      },
    });

    // Update job
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: JOB_STATUS.DONE,
        completedAt: new Date(),
        outputAssets: {
          connect: { id: videoAsset.id },
        },
      },
    });

    // Deduct tokens
    await prisma.tokenWallet.update({
      where: { userId },
      data: {
        balance: wallet.balance - TOKEN_COST.VIDEO_GENERATE,
      },
    });

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: JOB_STATUS.DONE,
        costTokens: TOKEN_COST.VIDEO_GENERATE,
      },
      video: {
        id: videoAsset.id,
        url: videoAsset.url,
        filename: videoAsset.filename,
      },
      remainingBalance: wallet.balance - TOKEN_COST.VIDEO_GENERATE,
    });
  } catch (error: any) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Video generasiya xətası' },
      { status: 500 }
    );
  }
}
