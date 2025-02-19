import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { MessageResponse } from "src/decorator/message-response.decorator";
import { User } from "src/decorator/user.decorator";
import { IUser } from "src/interfaces/custom.interface";
import { Public } from "src/decorator/public.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @MessageResponse("Create a new user")
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @MessageResponse("Find all users")
  async findAll(
    @Query() query: { current: string; pageSize: string },
    @Query() queryString: string,
  ) {
    const { current, pageSize } = query;

    return this.usersService.findAll(+current, +pageSize, queryString);
  }

  @Public()
  @Get(":id")
  @MessageResponse("Find a user by id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @MessageResponse("Update a user")
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(":id")
  @MessageResponse("Soft Delete a user")
  async remove(@Param("id") id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
