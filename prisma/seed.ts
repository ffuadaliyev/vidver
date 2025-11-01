import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@vidver.ai' },
    update: {},
    create: {
      email: 'demo@vidver.ai',
      name: 'Demo İstifadəçi',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // Create token wallet for demo user
  await prisma.tokenWallet.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      balance: 100,
      totalEarned: 100,
      totalSpent: 0,
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create brands and models (10 most popular brands, 10 models each)
  const brands = [
    {
      name: 'BMW',
      slug: 'bmw',
      popularity: 10,
      models: ['M3', 'M5', 'X5', 'X6', '3 Series', '5 Series', '7 Series', 'i8', 'X7', 'Z4'],
    },
    {
      name: 'Mercedes-Benz',
      slug: 'mercedes-benz',
      popularity: 9,
      models: ['C-Class', 'E-Class', 'S-Class', 'AMG GT', 'G-Class', 'GLE', 'GLC', 'A-Class', 'CLS', 'GLB'],
    },
    {
      name: 'Audi',
      slug: 'audi',
      popularity: 8,
      models: ['A3', 'A4', 'A6', 'A8', 'Q5', 'Q7', 'Q8', 'RS6', 'TT', 'R8'],
    },
    {
      name: 'Toyota',
      slug: 'toyota',
      popularity: 7,
      models: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Supra', 'Prius', 'Highlander', 'Yaris', 'C-HR', 'Avalon'],
    },
    {
      name: 'Honda',
      slug: 'honda',
      popularity: 6,
      models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline', 'Fit', 'Insight', 'Passport'],
    },
    {
      name: 'Hyundai',
      slug: 'hyundai',
      popularity: 5,
      models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'i30', 'Veloster', 'Palisade', 'Ioniq', 'Venue'],
    },
    {
      name: 'Kia',
      slug: 'kia',
      popularity: 4,
      models: ['Optima', 'Sorento', 'Sportage', 'Seltos', 'Rio', 'Stinger', 'Telluride', 'Carnival', 'Soul', 'Forte'],
    },
    {
      name: 'Volkswagen',
      slug: 'volkswagen',
      popularity: 3,
      models: ['Golf', 'Passat', 'Tiguan', 'Polo', 'Arteon', 'T-Roc', 'Touareg', 'ID.4', 'Atlas', 'Jetta'],
    },
    {
      name: 'Ford',
      slug: 'ford',
      popularity: 2,
      models: ['Mustang', 'F-150', 'Explorer', 'Escape', 'Edge', 'Ranger', 'Bronco', 'Expedition', 'Maverick', 'Focus'],
    },
    {
      name: 'Porsche',
      slug: 'porsche',
      popularity: 1,
      models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman', '718', 'Carrera', 'Turbo'],
    },
  ];

  for (const brandData of brands) {
    const brand = await prisma.brand.upsert({
      where: { slug: brandData.slug },
      update: {
        popularity: brandData.popularity,
      },
      create: {
        name: brandData.name,
        slug: brandData.slug,
        popularity: brandData.popularity,
        isActive: true,
      },
    });

    for (let i = 0; i < brandData.models.length; i++) {
      const modelName = brandData.models[i];
      await prisma.model.upsert({
        where: {
          brandId_slug: {
            brandId: brand.id,
            slug: modelName.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''),
          },
        },
        update: {
          popularity: brandData.models.length - i, // Higher popularity for first models
        },
        create: {
          name: modelName,
          slug: modelName.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''),
          brandId: brand.id,
          popularity: brandData.models.length - i,
          isActive: true,
        },
      });
    }

    console.log(`✅ Created brand: ${brand.name} with ${brandData.models.length} models`);
  }

  // Create image tuning presets
  const imagePresets = [
    { key: 'body_kit_sport', title: 'Sport Body Kit', description: 'Aqressiv sport görünüş' },
    { key: 'body_kit_luxury', title: 'Luxury Body Kit', description: 'Premium lüks stil' },
    { key: 'wheels_19_sport', title: '19" Sport Disklər', description: 'Böyük sport disklər' },
    { key: 'wheels_20_chrome', title: '20" Xrom Disklər', description: 'Parlaq xrom finish' },
    { key: 'spoiler_gt', title: 'GT Spoyler', description: 'Yüksək performans spoyler' },
    { key: 'hood_carbon', title: 'Karbon Kapot', description: 'Yüngül karbon fiber' },
    { key: 'lights_led', title: 'LED Fənərlər', description: 'Müasir LED texnologiya' },
    { key: 'wrap_matte_black', title: 'Mat Qara Wrap', description: 'Qara mat finish' },
    { key: 'wrap_chrome', title: 'Xrom Wrap', description: 'Parlaq metal görünüş' },
    { key: 'suspension_lowered', title: 'Aşağı Asqı', description: 'Sport aşağı duruş' },
  ];

  for (const preset of imagePresets) {
    await prisma.preset.upsert({
      where: { key: preset.key },
      update: {},
      create: {
        type: 'IMAGE',
        key: preset.key,
        title: preset.title,
        description: preset.description,
        isActive: true,
      },
    });
  }

  console.log(`✅ Created ${imagePresets.length} image presets`);

  // Create video effect presets
  const videoPresets = [
    { key: '360_spin', title: '360° Spin', description: 'Tam dövrə fırlanma' },
    { key: 'neon_driveby', title: 'Neon Drive-by', description: 'Neon effektli keçid' },
    { key: 'light_sweep', title: 'Light Sweep', description: 'İşıq süpürmə' },
    { key: 'showroom_pan', title: 'Showroom Pan', description: 'Salon hərəkəti' },
    { key: 'zoom_reveal', title: 'Zoom Reveal', description: 'Zoom açılış' },
    { key: 'spec_highlight', title: 'Spec Highlight', description: 'Xüsusiyyət vurğusu' },
    { key: 'dramatic_reveal', title: 'Dramatic Reveal', description: 'Dramatik açılış' },
    { key: 'rain_effect', title: 'Rain Effect', description: 'Yağış effekti' },
  ];

  for (const preset of videoPresets) {
    await prisma.preset.upsert({
      where: { key: preset.key },
      update: {},
      create: {
        type: 'VIDEO',
        key: preset.key,
        title: preset.title,
        description: preset.description,
        isActive: true,
      },
    });
  }

  console.log(`✅ Created ${videoPresets.length} video presets`);

  console.log('✨ Seeding completed!');
  console.log('📧 Demo user: demo@vidver.ai / demo123');
  console.log('📊 Total brands: 10');
  console.log('📊 Total models: 100 (10 per brand)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
