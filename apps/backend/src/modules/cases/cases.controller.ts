import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { CasesService } from './cases.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Public()
  @Get()
  async findAll() {
    return this.casesService.findAll();
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.casesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug/open')
  async openCase(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.casesService.openCase(user.userId, slug);
  }
}
