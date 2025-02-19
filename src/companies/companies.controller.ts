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
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { User } from "src/decorator/user.decorator";

import { MessageResponse } from "src/decorator/message-response.decorator";
import { IUser } from "src/interfaces/custom.interface";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @MessageResponse("Get all companies with paginate")
  findAll(
    @Query() query: { current: string; pageSize: string },
    @Query() queryString: string,
  ) {
    const { current, pageSize } = query;

    return this.companiesService.findAll(+current, +pageSize, queryString);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
