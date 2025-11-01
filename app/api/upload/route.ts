import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, ASSET_TYPE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const side = formData.get('side') as string | null; // FRONT, REAR, LEFT, RIGHT

    if (!file) {
      return NextResponse.json({ error: 'Fayl tapılmadı' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Yalnız JPG, PNG, WebP formatları qəbul edilir' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fayl həcmi maksimum ${MAX_FILE_SIZE / 1024 / 1024}MB ola bilər` },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const asset = await prisma.asset.create({
      data: {
        userId: (session.user as any).id,
        type: ASSET_TYPE.IMAGE,
        side: side || null,
        url: `/uploads/${filename}`,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        url: asset.url,
        filename: asset.filename,
        size: asset.size,
        side: asset.side,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Fayl yükləmə xətası' },
      { status: 500 }
    );
  }
}
