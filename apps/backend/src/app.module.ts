import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CasesModule } from './modules/cases/cases.module';
import { ItemsModule } from './modules/items/items.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    AuthModule,
    UsersModule,
    CasesModule,
    ItemsModule,
    AdminModule,
  ],
})
export class AppModule {}
