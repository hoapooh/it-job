import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email address." })
  @IsNotEmpty({ message: "Please enter an email address." })
  email: string;

  @IsStrongPassword()
  @IsNotEmpty({ message: "Please enter a password." })
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;
}
