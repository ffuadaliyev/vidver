import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'original' or 'result'

    // Get user's assets
    const assets = await prisma.asset.findMany({
      where: {
        userId: session.user.id,
        ...(type && { type }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        job: {
          select: {
            id: true,
            kind: true,
            status: true,
            createdAt: true,
          },
        },
      },
      take: 100, // Limit to last 100 assets
    });

    return NextResponse.json({
      assets,
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
