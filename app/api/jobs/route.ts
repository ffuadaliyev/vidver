import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const searchParams = request.nextUrl.searchParams;
    const kind = searchParams.get('kind'); // IMAGE or VIDEO
    const status = searchParams.get('status'); // PENDING, PROCESSING, DONE, FAILED
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { userId };
    if (kind) where.kind = kind;
    if (status) where.status = status;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          brand: true,
          model: true,
          inputAssets: {
            select: {
              id: true,
              url: true,
              side: true,
              type: true,
            },
          },
          outputAssets: {
            select: {
              id: true,
              url: true,
              side: true,
              type: true,
              meta: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs: jobs.map(job => ({
        id: job.id,
        kind: job.kind,
        status: job.status,
        brand: job.brand?.name,
        model: job.model?.name,
        presets: job.presets ? JSON.parse(job.presets) : [],
        costTokens: job.costTokens,
        errorMessage: job.errorMessage,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        completedAt: job.completedAt,
        inputAssets: job.inputAssets,
        outputAssets: job.outputAssets,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Jobs error:', error);
    return NextResponse.json(
      { error: 'İşlər yüklənə bilmədi' },
      { status: 500 }
    );
  }
}
