import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from "class-validator";
import mongoose from "mongoose";
import { Type } from "class-transformer";

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty({ message: "Please enter a name." })
  name: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email address." })
  @IsNotEmpty({ message: "Please enter an email address." })
  email: string;

  @IsStrongPassword()
  @IsNotEmpty({ message: "Please enter a password." })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "Please enter a name." })
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: "Please enter an age." })
  age: number;

  @IsString()
  @IsNotEmpty({ message: "Please enter a gender." })
  gender: string;

  @IsString()
  @IsNotEmpty({ message: "Please enter an address." })
  address: string;

  @IsString()
  @IsNotEmpty({ message: "Please enter a role." })
  role: string;

  // NOTE: validate object type
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: string;
}
