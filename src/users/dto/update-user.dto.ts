import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends OmitType(CreateUserDto, [
  "password",
] as const) {
  @IsString()
  @IsOptional()
  _id: string;
}
