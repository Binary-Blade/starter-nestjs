import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { TokenService } from 'src/config/securities/token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) { }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    const { email, password } = loginDto;
    return await this.authService.login(email, password);

  }

  @UseGuards(AccessTokenGuard)
  @Post('/refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.tokenService.refreshToken(refreshToken);
  }
}
