import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Public } from "src/decorator/public.decorator";
import { Request } from "express";
import { IUser } from "src/users/users.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("login")
  login(@Req() req: Request) {
    return this.authService.login(req.user as IUser);
  }

  @Get("profile")
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
