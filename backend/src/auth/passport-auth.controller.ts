import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PassportLocalGuard } from './guard/passport-local.guard';
import { AuthService } from './auth.service';
import { PassportJwtAuthGuard } from './guard/passport-jwt.guard';

@Controller('passport-auth')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  login(@Body() request) {
    return this.authService.signIn(request);
  }

  @Get('me')
  @UseGuards(PassportJwtAuthGuard)
  getUserInfo(@Request() request) {
    return request.user;
  }
}
