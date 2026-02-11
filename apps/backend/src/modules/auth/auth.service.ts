import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, dto.email)).limit(1);
    if (existingUser.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUsername = await db.select().from(users).where(eq(users.username, dto.username)).limit(1);
    if (existingUsername.length > 0) {
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const [user] = await db.insert(users).values({
      email: dto.email,
      username: dto.username,
      passwordHash,
      balance: '1000', // Starting balance
    }).returning();

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.isAdmin);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        balance: user.balance,
        isAdmin: user.isAdmin,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, dto.email)).limit(1);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.isAdmin);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        balance: user.balance,
        isAdmin: user.isAdmin,
      },
      ...tokens,
    };
  }

  async getMe(userId: number) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      balance: user.balance,
      isAdmin: user.isAdmin,
    };
  }

  private async generateTokens(userId: number, email: string, isAdmin: boolean) {
    const payload = { sub: userId, email, isAdmin };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
