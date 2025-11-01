import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TOKEN_COST, JOB_STATUS, JOB_KIND, ASSET_TYPE } from '@/lib/constants';

// Mock delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { assetIds, brandId, modelId, presets } = body;

    if (!assetIds || assetIds.length === 0) {
      return NextResponse.json({ error: 'Ən azı bir şəkil tələb olunur' }, { status: 400 });
    }

    // Check token balance
    const wallet = await prisma.tokenWallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < TOKEN_COST.IMAGE_MODIFY) {
      return NextResponse.json(
        { error: 'Kifayət qədər token yoxdur' },
        { status: 402 }
      );
    }

    // Create job with PROCESSING status
    const job = await prisma.job.create({
      data: {
        userId,
        kind: JOB_KIND.IMAGE,
        brandId,
        modelId,
        presets: JSON.stringify(presets || []),
        status: JOB_STATUS.PROCESSING,
        costTokens: TOKEN_COST.IMAGE_MODIFY,
      },
    });

    // Connect input assets
    await prisma.job.update({
      where: { id: job.id },
      data: {
        inputAssets: {
          connect: assetIds.map((id: string) => ({ id })),
        },
      },
    });

    // Simulate AI processing (5 seconds)
    await delay(5000);

    // Create mock output assets (demo results)
    const outputAssets = [];
    const sides = ['FRONT', 'REAR', 'LEFT', 'RIGHT'];

    for (const side of sides) {
      const asset = await prisma.asset.create({
        data: {
          userId,
          type: ASSET_TYPE.IMAGE,
          side,
          url: `/demo/results/${side.toLowerCase()}-tuned.jpg`,
          filename: `${side.toLowerCase()}-tuned.jpg`,
          mimeType: 'image/jpeg',
          size: 1024000, // Mock size
          meta: JSON.stringify({ generated: true, jobId: job.id }),
        },
      });
      outputAssets.push(asset);
    }

    // Update job status and connect output assets
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: JOB_STATUS.DONE,
        completedAt: new Date(),
        outputAssets: {
          connect: outputAssets.map(a => ({ id: a.id })),
        },
      },
    });

    // Deduct tokens
    await prisma.tokenWallet.update({
      where: { userId },
      data: {
        balance: wallet.balance - TOKEN_COST.IMAGE_MODIFY,
      },
    });

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: JOB_STATUS.DONE,
        costTokens: TOKEN_COST.IMAGE_MODIFY,
      },
      outputAssets: outputAssets.map(a => ({
        id: a.id,
        url: a.url,
        side: a.side,
      })),
      remainingBalance: wallet.balance - TOKEN_COST.IMAGE_MODIFY,
    });
  } catch (error: any) {
    console.error('Modify error:', error);
    return NextResponse.json(
      { error: 'Modifikasiya xətası' },
      { status: 500 }
    );
  }
}
