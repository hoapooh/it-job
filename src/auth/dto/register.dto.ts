import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class RegisterUserDto {
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
}
