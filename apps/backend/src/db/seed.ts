import { db } from './index';
import { users, cases, items, caseItems } from './schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create users
  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password', 10);

  const [testUser] = await db.insert(users).values({
    email: 'test@test.com',
    username: 'testuser',
    passwordHash,
    balance: '10000',
    isAdmin: false,
  }).returning();

  const [adminUser] = await db.insert(users).values({
    email: 'admin@test.com',
    username: 'admin',
    passwordHash,
    balance: '100000',
    isAdmin: true,
  }).returning();

  console.log('✅ Users created');

  // Create items
  console.log('Creating items...');
  const itemsData = [
    // Legendary (2%)
    { name: 'AWP | Dragon Lore', slug: 'awp-dragon-lore', rarity: 'legendary', price: '5000', imageUrl: 'https://via.placeholder.com/200?text=AWP+Dragon+Lore' },
    { name: 'Karambit | Fade', slug: 'karambit-fade', rarity: 'legendary', price: '4500', imageUrl: 'https://via.placeholder.com/200?text=Karambit+Fade' },

    // Epic (8%)
    { name: 'AK-47 | Fire Serpent', slug: 'ak47-fire-serpent', rarity: 'epic', price: '1500', imageUrl: 'https://via.placeholder.com/200?text=AK47+Fire+Serpent' },
    { name: 'M4A4 | Howl', slug: 'm4a4-howl', rarity: 'epic', price: '1800', imageUrl: 'https://via.placeholder.com/200?text=M4A4+Howl' },
    { name: 'Butterfly Knife | Slaughter', slug: 'butterfly-slaughter', rarity: 'epic', price: '2000', imageUrl: 'https://via.placeholder.com/200?text=Butterfly+Slaughter' },

    // Rare (20%)
    { name: 'AK-47 | Redline', slug: 'ak47-redline', rarity: 'rare', price: '500', imageUrl: 'https://via.placeholder.com/200?text=AK47+Redline' },
    { name: 'AWP | Asiimov', slug: 'awp-asiimov', rarity: 'rare', price: '600', imageUrl: 'https://via.placeholder.com/200?text=AWP+Asiimov' },
    { name: 'M4A1-S | Hyper Beast', slug: 'm4a1s-hyper-beast', rarity: 'rare', price: '450', imageUrl: 'https://via.placeholder.com/200?text=M4A1S+Hyper+Beast' },
    { name: 'Glock-18 | Fade', slug: 'glock18-fade', rarity: 'rare', price: '550', imageUrl: 'https://via.placeholder.com/200?text=Glock18+Fade' },

    // Common (70%)
    { name: 'AK-47 | Blue Laminate', slug: 'ak47-blue-laminate', rarity: 'common', price: '50', imageUrl: 'https://via.placeholder.com/200?text=AK47+Blue+Laminate' },
    { name: 'M4A4 | Desert-Strike', slug: 'm4a4-desert-strike', rarity: 'common', price: '40', imageUrl: 'https://via.placeholder.com/200?text=M4A4+Desert+Strike' },
    { name: 'AWP | Worm God', slug: 'awp-worm-god', rarity: 'common', price: '30', imageUrl: 'https://via.placeholder.com/200?text=AWP+Worm+God' },
    { name: 'USP-S | Guardian', slug: 'usps-guardian', rarity: 'common', price: '45', imageUrl: 'https://via.placeholder.com/200?text=USPS+Guardian' },
    { name: 'P250 | Muertos', slug: 'p250-muertos', rarity: 'common', price: '35', imageUrl: 'https://via.placeholder.com/200?text=P250+Muertos' },
    { name: 'Galil AR | Eco', slug: 'galil-eco', rarity: 'common', price: '25', imageUrl: 'https://via.placeholder.com/200?text=Galil+Eco' },
    { name: 'FAMAS | Pulse', slug: 'famas-pulse', rarity: 'common', price: '30', imageUrl: 'https://via.placeholder.com/200?text=FAMAS+Pulse' },
    { name: 'MP9 | Dart', slug: 'mp9-dart', rarity: 'common', price: '20', imageUrl: 'https://via.placeholder.com/200?text=MP9+Dart' },
  ];

  const createdItems = await db.insert(items).values(itemsData).returning();
  console.log('✅ Items created');

  // Create cases
  console.log('Creating cases...');
  const casesData = [
    {
      name: 'Dragon Case',
      slug: 'dragon-case',
      description: 'Contains legendary dragon-themed skins',
      price: '100',
      imageUrl: 'https://via.placeholder.com/300?text=Dragon+Case',
      isActive: true,
    },
    {
      name: 'Fire Case',
      slug: 'fire-case',
      description: 'Hot skins with fire designs',
      price: '75',
      imageUrl: 'https://via.placeholder.com/300?text=Fire+Case',
      isActive: true,
    },
    {
      name: 'Starter Case',
      slug: 'starter-case',
      description: 'Perfect for beginners',
      price: '25',
      imageUrl: 'https://via.placeholder.com/300?text=Starter+Case',
      isActive: true,
    },
    {
      name: 'Premium Case',
      slug: 'premium-case',
      description: 'High-value premium skins',
      price: '150',
      imageUrl: 'https://via.placeholder.com/300?text=Premium+Case',
      isActive: true,
    },
    {
      name: 'Mystery Case',
      slug: 'mystery-case',
      description: 'Mystery box with random items',
      price: '50',
      imageUrl: 'https://via.placeholder.com/300?text=Mystery+Case',
      isActive: true,
    },
  ];

  const createdCases = await db.insert(cases).values(casesData).returning();
  console.log('✅ Cases created');

  // Add items to cases with drop rates
  console.log('Adding items to cases...');

  // Dragon Case - premium items
  await db.insert(caseItems).values([
    { caseId: createdCases[0].id, itemId: createdItems[0].id, dropRate: '1' }, // AWP Dragon Lore - 1%
    { caseId: createdCases[0].id, itemId: createdItems[1].id, dropRate: '1' }, // Karambit Fade - 1%
    { caseId: createdCases[0].id, itemId: createdItems[2].id, dropRate: '5' }, // AK-47 Fire Serpent - 5%
    { caseId: createdCases[0].id, itemId: createdItems[3].id, dropRate: '5' }, // M4A4 Howl - 5%
    { caseId: createdCases[0].id, itemId: createdItems[5].id, dropRate: '15' }, // AK-47 Redline - 15%
    { caseId: createdCases[0].id, itemId: createdItems[6].id, dropRate: '15' }, // AWP Asiimov - 15%
    { caseId: createdCases[0].id, itemId: createdItems[9].id, dropRate: '28.5' }, // Common items
    { caseId: createdCases[0].id, itemId: createdItems[10].id, dropRate: '29.5' },
  ]);

  // Fire Case
  await db.insert(caseItems).values([
    { caseId: createdCases[1].id, itemId: createdItems[2].id, dropRate: '3' }, // AK-47 Fire Serpent
    { caseId: createdCases[1].id, itemId: createdItems[3].id, dropRate: '3' }, // M4A4 Howl
    { caseId: createdCases[1].id, itemId: createdItems[4].id, dropRate: '4' }, // Butterfly Knife
    { caseId: createdCases[1].id, itemId: createdItems[5].id, dropRate: '10' }, // AK-47 Redline
    { caseId: createdCases[1].id, itemId: createdItems[6].id, dropRate: '10' }, // AWP Asiimov
    { caseId: createdCases[1].id, itemId: createdItems[7].id, dropRate: '10' }, // M4A1-S Hyper Beast
    { caseId: createdCases[1].id, itemId: createdItems[9].id, dropRate: '20' },
    { caseId: createdCases[1].id, itemId: createdItems[10].id, dropRate: '20' },
    { caseId: createdCases[1].id, itemId: createdItems[11].id, dropRate: '20' },
  ]);

  // Starter Case - mostly common
  await db.insert(caseItems).values([
    { caseId: createdCases[2].id, itemId: createdItems[5].id, dropRate: '5' }, // Rare
    { caseId: createdCases[2].id, itemId: createdItems[6].id, dropRate: '5' },
    { caseId: createdCases[2].id, itemId: createdItems[9].id, dropRate: '15' }, // Common
    { caseId: createdCases[2].id, itemId: createdItems[10].id, dropRate: '15' },
    { caseId: createdCases[2].id, itemId: createdItems[11].id, dropRate: '15' },
    { caseId: createdCases[2].id, itemId: createdItems[12].id, dropRate: '15' },
    { caseId: createdCases[2].id, itemId: createdItems[13].id, dropRate: '15' },
    { caseId: createdCases[2].id, itemId: createdItems[14].id, dropRate: '15' },
  ]);

  // Premium Case - high value
  await db.insert(caseItems).values([
    { caseId: createdCases[3].id, itemId: createdItems[0].id, dropRate: '2' }, // Legendary
    { caseId: createdCases[3].id, itemId: createdItems[1].id, dropRate: '2' },
    { caseId: createdCases[3].id, itemId: createdItems[2].id, dropRate: '8' }, // Epic
    { caseId: createdCases[3].id, itemId: createdItems[3].id, dropRate: '8' },
    { caseId: createdCases[3].id, itemId: createdItems[4].id, dropRate: '8' },
    { caseId: createdCases[3].id, itemId: createdItems[5].id, dropRate: '18' }, // Rare
    { caseId: createdCases[3].id, itemId: createdItems[6].id, dropRate: '18' },
    { caseId: createdCases[3].id, itemId: createdItems[7].id, dropRate: '18' },
    { caseId: createdCases[3].id, itemId: createdItems[9].id, dropRate: '18' }, // Common
  ]);

  // Mystery Case - balanced
  await db.insert(caseItems).values([
    { caseId: createdCases[4].id, itemId: createdItems[0].id, dropRate: '1' },
    { caseId: createdCases[4].id, itemId: createdItems[1].id, dropRate: '1' },
    { caseId: createdCases[4].id, itemId: createdItems[2].id, dropRate: '4' },
    { caseId: createdCases[4].id, itemId: createdItems[3].id, dropRate: '4' },
    { caseId: createdCases[4].id, itemId: createdItems[5].id, dropRate: '10' },
    { caseId: createdCases[4].id, itemId: createdItems[6].id, dropRate: '10' },
    { caseId: createdCases[4].id, itemId: createdItems[7].id, dropRate: '10' },
    { caseId: createdCases[4].id, itemId: createdItems[9].id, dropRate: '15' },
    { caseId: createdCases[4].id, itemId: createdItems[10].id, dropRate: '15' },
    { caseId: createdCases[4].id, itemId: createdItems[11].id, dropRate: '15' },
    { caseId: createdCases[4].id, itemId: createdItems[12].id, dropRate: '15' },
  ]);

  console.log('✅ Items added to cases');

  console.log('🎉 Seeding completed!');
  console.log('\nTest accounts:');
  console.log('Regular user: test@test.com / password');
  console.log('Admin user: admin@test.com / password');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
