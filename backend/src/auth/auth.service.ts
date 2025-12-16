import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type AuthInput = { name: string; password: string };
type SignInData = { id: number; name: string };
type AuthResult = { accessToken: string; id: number; name: string };
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.signIn(user);
  }

  // 유저 input이 db에 저장되어있는지 확인
  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findUserByName(input.name);
    if (user && user.password === input.password) {
      return {
        id: user.id,
        name: user.name,
      };
    }
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.id,
      username: user.name,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return { accessToken, id: user.id, name: user.name };
  }
}
