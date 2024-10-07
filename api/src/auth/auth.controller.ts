import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: {email:string, password:string}) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
