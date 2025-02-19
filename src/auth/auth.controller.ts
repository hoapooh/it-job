import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Public } from "src/decorator/public.decorator";
import { User } from "src/decorator/user.decorator";
import { MessageResponse } from "src/decorator/message-response.decorator";
import { IUser } from "src/interfaces/custom.interface";
import { RegisterUserDto } from "./dto/register.dto";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessageResponse("Register a new user")
  @Public()
  @Post("register")
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @MessageResponse("Login success")
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("login")
  login(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(user, response);
  }

  @MessageResponse("Logout success")
  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
    return this.authService.logout(response, user._id.toString());
  }

  @MessageResponse("Get current account")
  @Get("account")
  getAccount(@User() user: IUser) {
    return { user };
  }

  @MessageResponse("Refresh and assign new access token")
  @Public()
  @Get("refresh")
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies["it-job-refresh-token"];

    return this.authService.processNewToken(refresh_token, response);
  }
}
