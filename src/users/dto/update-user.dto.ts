import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["password"] as const),
) {
  @IsString()
  @IsNotEmpty({ message: "Id can not be empty" })
  _id: string;
}
