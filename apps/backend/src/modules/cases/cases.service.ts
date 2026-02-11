import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../db';
import { cases, caseItems, items, users, userInventory, caseOpenings } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

@Injectable()
export class CasesService {
  async findAll() {
    const allCases = await db
      .select({
        id: cases.id,
        name: cases.name,
        slug: cases.slug,
        description: cases.description,
        imageUrl: cases.imageUrl,
        price: cases.price,
        isActive: cases.isActive,
      })
      .from(cases)
      .where(eq(cases.isActive, true));

    return allCases;
  }

  async findBySlug(slug: string) {
    const [caseData] = await db.select().from(cases).where(eq(cases.slug, slug)).limit(1);
    if (!caseData) {
      throw new NotFoundException('Case not found');
    }

    const caseItemsData = await db
      .select({
        id: caseItems.id,
        dropRate: caseItems.dropRate,
        item: {
          id: items.id,
          name: items.name,
          slug: items.slug,
          description: items.description,
          imageUrl: items.imageUrl,
          rarity: items.rarity,
          price: items.price,
        },
      })
      .from(caseItems)
      .leftJoin(items, eq(caseItems.itemId, items.id))
      .where(eq(caseItems.caseId, caseData.id));

    return {
      ...caseData,
      items: caseItemsData,
    };
  }

  async openCase(userId: number, slug: string) {
    // Get case
    const [caseData] = await db.select().from(cases).where(and(eq(cases.slug, slug), eq(cases.isActive, true))).limit(1);
    if (!caseData) {
      throw new NotFoundException('Case not found');
    }

    // Get user
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check balance
    const casePrice = parseFloat(caseData.price);
    const userBalance = parseFloat(user.balance);
    if (userBalance < casePrice) {
      throw new BadRequestException('Insufficient balance');
    }

    // Get case items with drop rates
    const caseItemsData = await db
      .select({
        itemId: caseItems.itemId,
        dropRate: caseItems.dropRate,
      })
      .from(caseItems)
      .where(eq(caseItems.caseId, caseData.id));

    if (caseItemsData.length === 0) {
      throw new BadRequestException('Case has no items');
    }

    // Calculate random item based on drop rates
    const wonItem = this.selectRandomItem(caseItemsData);

    // Get full item data
    const [itemData] = await db.select().from(items).where(eq(items.id, wonItem.itemId)).limit(1);

    // Deduct balance
    await db
      .update(users)
      .set({ balance: (userBalance - casePrice).toFixed(2) })
      .where(eq(users.id, userId));

    // Add to inventory
    await db.insert(userInventory).values({
      userId,
      itemId: wonItem.itemId,
    });

    // Record opening
    await db.insert(caseOpenings).values({
      userId,
      caseId: caseData.id,
      itemId: wonItem.itemId,
    });

    return {
      case: {
        id: caseData.id,
        name: caseData.name,
        price: caseData.price,
      },
      item: itemData,
      newBalance: (userBalance - casePrice).toFixed(2),
    };
  }

  private selectRandomItem(items: Array<{ itemId: number; dropRate: string }>) {
    const totalRate = items.reduce((sum, item) => sum + parseFloat(item.dropRate), 0);
    let random = Math.random() * totalRate;

    for (const item of items) {
      random -= parseFloat(item.dropRate);
      if (random <= 0) {
        return item;
      }
    }

    return items[items.length - 1];
  }
}
