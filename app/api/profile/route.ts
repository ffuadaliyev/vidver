import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get user with token wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tokenWallet: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
    }

    // Get recent jobs
    const recentJobs = await prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        brand: true,
        model: true,
        inputAssets: {
          select: {
            id: true,
            url: true,
            side: true,
          },
        },
        outputAssets: {
          select: {
            id: true,
            url: true,
            side: true,
          },
        },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        image: user.image,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      tokenBalance: user.tokenWallet?.balance || 0,
      recentJobs: recentJobs.map(job => ({
        id: job.id,
        kind: job.kind,
        status: job.status,
        brand: job.brand?.name,
        model: job.model?.name,
        costTokens: job.costTokens,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        inputAssets: job.inputAssets,
        outputAssets: job.outputAssets,
      })),
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Profil yüklənə bilmədi' },
      { status: 500 }
    );
  }
}
