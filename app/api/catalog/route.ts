import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VIDEO_EFFECTS, TUNING_CATEGORIES } from '@/lib/constants';

export async function GET() {
  try {
    // Get brands with models
    const brands = await prisma.brand.findMany({
      include: {
        models: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Get presets
    const imagePresets = await prisma.preset.findMany({
      where: { type: 'IMAGE' },
      orderBy: { title: 'asc' },
    });

    const videoPresets = await prisma.preset.findMany({
      where: { type: 'VIDEO' },
      orderBy: { title: 'asc' },
    });

    return NextResponse.json({
      brands: brands.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        models: b.models.map(m => ({
          id: m.id,
          name: m.name,
          slug: m.slug,
        })),
      })),
      tuningCategories: TUNING_CATEGORIES,
      imagePresets: imagePresets.map(p => ({
        id: p.id,
        key: p.key,
        title: p.title,
        description: p.description,
      })),
      videoEffects: VIDEO_EFFECTS,
      videoPresets: videoPresets.map(p => ({
        id: p.id,
        key: p.key,
        title: p.title,
        description: p.description,
      })),
    });
  } catch (error) {
    console.error('Catalog error:', error);
    return NextResponse.json(
      { error: 'Kataloq yüklənə bilmədi' },
      { status: 500 }
    );
  }
}
