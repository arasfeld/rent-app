import { Controller, Post, Get, Body, UseGuards, Patch } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@CurrentUser('id') userId: string) {
    return this.authService.refreshToken(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto
  ) {
    return this.authService.updateProfile(userId, dto);
  }
}
