import { Injectable } from "@nestjs/common";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Company, CompanyDocument } from "./schema/company.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { FilterQuery } from "mongoose";

@Injectable()
export class CompaniesService {
  // NOTE: Using SoftDeleteModel instead of Model to enable soft delete from soft-delete-plugin-mongoose
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(query: FilterQuery<Company>): Promise<Company> {
    return await this.companyModel.create(query);
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
