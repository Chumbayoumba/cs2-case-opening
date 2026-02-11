import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { users, userInventory, caseOpenings, items } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async getProfile(userId: number) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const openingsCount = await db.select().from(caseOpenings).where(eq(caseOpenings.userId, userId));

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      balance: user.balance,
      totalCasesOpened: openingsCount.length,
      createdAt: user.createdAt,
    };
  }

  async getInventory(userId: number) {
    const inventory = await db
      .select({
        id: userInventory.id,
        acquiredAt: userInventory.acquiredAt,
        isSold: userInventory.isSold,
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
      .from(userInventory)
      .leftJoin(items, eq(userInventory.itemId, items.id))
      .where(eq(userInventory.userId, userId))
      .orderBy(desc(userInventory.acquiredAt));

    return inventory;
  }

  async getHistory(userId: number) {
    const history = await db
      .select({
        id: caseOpenings.id,
        createdAt: caseOpenings.createdAt,
        caseId: caseOpenings.caseId,
        item: {
          id: items.id,
          name: items.name,
          rarity: items.rarity,
          price: items.price,
          imageUrl: items.imageUrl,
        },
      })
      .from(caseOpenings)
      .leftJoin(items, eq(caseOpenings.itemId, items.id))
      .where(eq(caseOpenings.userId, userId))
      .orderBy(desc(caseOpenings.createdAt))
      .limit(50);

    return history;
  }
}
