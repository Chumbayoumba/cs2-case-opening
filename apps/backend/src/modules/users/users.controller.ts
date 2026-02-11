import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.userId);
  }

  @Get('inventory')
  async getInventory(@CurrentUser() user: any) {
    return this.usersService.getInventory(user.userId);
  }

  @Get('history')
  async getHistory(@CurrentUser() user: any) {
    return this.usersService.getHistory(user.userId);
  }
}
