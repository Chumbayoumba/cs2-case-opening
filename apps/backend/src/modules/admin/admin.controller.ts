import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateCaseDto, UpdateCaseDto, CreateItemDto, UpdateItemDto, AddItemToCaseDto } from '../../common/dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Cases
  @Get('cases')
  async getAllCases() {
    return this.adminService.getAllCases();
  }

  @Post('cases')
  async createCase(@Body() dto: CreateCaseDto) {
    return this.adminService.createCase(dto);
  }

  @Put('cases/:id')
  async updateCase(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCaseDto) {
    return this.adminService.updateCase(id, dto);
  }

  @Delete('cases/:id')
  async deleteCase(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCase(id);
  }

  // Items
  @Get('items')
  async getAllItems() {
    return this.adminService.getAllItems();
  }

  @Post('items')
  async createItem(@Body() dto: CreateItemDto) {
    return this.adminService.createItem(dto);
  }

  @Put('items/:id')
  async updateItem(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemDto) {
    return this.adminService.updateItem(id, dto);
  }

  @Delete('items/:id')
  async deleteItem(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteItem(id);
  }

  // Case Items
  @Post('cases/:id/items')
  async addItemToCase(@Param('id', ParseIntPipe) id: number, @Body() dto: AddItemToCaseDto) {
    return this.adminService.addItemToCase(id, dto);
  }

  @Delete('cases/:caseId/items/:itemId')
  async removeItemFromCase(
    @Param('caseId', ParseIntPipe) caseId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.adminService.removeItemFromCase(caseId, itemId);
  }
}
