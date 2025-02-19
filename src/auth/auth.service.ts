import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/interfaces/custom.interface";
import { RegisterUserDto } from "./dto/register.dto";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import ms, { StringValue } from "ms";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // METHOD: helper function to create refresh token
  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN"),
    });

    return refreshToken;
  };

  // METHOD: helper function to process new token
  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      });

      let user = await this.usersService.findUserByRefreshToken(refresh_token);

      if (user) {
        const { _id, email, name, role } = user;

        const payload = {
          sub: "token refresh",
          iss: "from server",
          _id,
          email,
          name,
          role,
        };

        const refresh_Token = this.createRefreshToken(payload);

        // NOTE: Update user with refresh token
        await this.usersService.updateUserToken(refresh_Token, _id.toString());

        // NOTE: set refresh token as cookies -- clear before set new one
        response.clearCookie("it-job-refresh-token");
        response.cookie("it-job-refresh-token", refresh_Token, {
          httpOnly: true,
          maxAge: ms(
            `${this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN")}` as StringValue,
          ),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            email,
            name,
            role,
          },
        };
      } else {
        throw new BadRequestException("Invalid refresh token");
      }
    } catch (error) {
      throw new BadRequestException("Invalid refresh token");
    }
  };

  // METHOD: Validate user -- using for LocalStrategy from passportjs
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = this.usersService.isValidPassword(pass, user.password);

    if (isValid) {
      return user;
    }

    return null;
  }

  // METHOD: Register a new user
  async register(registerUser: RegisterUserDto) {
    const user = await this.usersService.register(registerUser);

    return {
      _id: user._id,
      createdAt: user.createdAt,
    };
  }

  // METHOD: Login a user
  async login(user: IUser, response: Response) {
    const { _id, email, name, role } = user;

    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      email,
      name,
      role,
    };

    const refresh_Token = this.createRefreshToken(payload);

    // NOTE: Update user with refresh token
    await this.usersService.updateUserToken(refresh_Token, _id);

    // NOTE: set refresh token as cookies
    response.cookie("it-job-refresh-token", refresh_Token, {
      httpOnly: true,
      maxAge: ms(
        `${this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN")}` as StringValue,
      ),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        role,
      },
    };
  }

  // METHOD: Logout a user
  logout = async (response: Response, _id: string) => {
    await this.usersService.updateUserToken("", _id);

    response.clearCookie("it-job-refresh-token");

    return "Logout success";
  };
}
