import { IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: "Please enter your company name." })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "Please enter your address." })
  address: string;

  @IsString()
  @IsNotEmpty({ message: "Please enter your company description." })
  description: string;
}
