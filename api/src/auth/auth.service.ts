import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersService.findByEmail(email);

    if (user == null) {
      throw new NotFoundException("Credentials don't match records");
    }

    const is_match = await bcrypt.compare(password, user.password);

    if (!is_match) {
      throw new UnauthorizedException("Credentials don't match records");
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
