import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../db';
import { cases, items, caseItems } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { CreateCaseDto, UpdateCaseDto, CreateItemDto, UpdateItemDto, AddItemToCaseDto } from '../../common/dto/admin.dto';

@Injectable()
export class AdminService {
  // Cases
  async getAllCases() {
    return db.select().from(cases);
  }

  async createCase(dto: CreateCaseDto) {
    const [newCase] = await db.insert(cases).values({
      ...dto,
      price: dto.price.toString(),
    }).returning();
    return newCase;
  }

  async updateCase(id: number, dto: UpdateCaseDto) {
    const updateData: any = { ...dto };
    if (dto.price !== undefined) {
      updateData.price = dto.price.toString();
    }
    const [updated] = await db.update(cases).set(updateData).where(eq(cases.id, id)).returning();
    if (!updated) {
      throw new NotFoundException('Case not found');
    }
    return updated;
  }

  async deleteCase(id: number) {
    const [deleted] = await db.delete(cases).where(eq(cases.id, id)).returning();
    if (!deleted) {
      throw new NotFoundException('Case not found');
    }
    return { message: 'Case deleted successfully' };
  }

  // Items
  async getAllItems() {
    return db.select().from(items);
  }

  async createItem(dto: CreateItemDto) {
    const [newItem] = await db.insert(items).values({
      ...dto,
      price: dto.price.toString(),
    }).returning();
    return newItem;
  }

  async updateItem(id: number, dto: UpdateItemDto) {
    const updateData: any = { ...dto };
    if (dto.price !== undefined) {
      updateData.price = dto.price.toString();
    }
    const [updated] = await db.update(items).set(updateData).where(eq(items.id, id)).returning();
    if (!updated) {
      throw new NotFoundException('Item not found');
    }
    return updated;
  }

  async deleteItem(id: number) {
    const [deleted] = await db.delete(items).where(eq(items.id, id)).returning();
    if (!deleted) {
      throw new NotFoundException('Item not found');
    }
    return { message: 'Item deleted successfully' };
  }

  // Case Items
  async addItemToCase(caseId: number, dto: AddItemToCaseDto) {
    const [caseItem] = await db.insert(caseItems).values({
      caseId,
      itemId: dto.itemId,
      dropRate: dto.dropRate.toString(),
    }).returning();
    return caseItem;
  }

  async removeItemFromCase(caseId: number, itemId: number) {
    await db.delete(caseItems).where(and(eq(caseItems.caseId, caseId), eq(caseItems.itemId, itemId)));
    return { message: 'Item removed from case' };
  }
}
