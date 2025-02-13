import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/users/users.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(user: IUser) {
    const { _id, email, name, role } = user;

    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      email,
      name,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      email,
      name,
      role,
    };
  }
}
