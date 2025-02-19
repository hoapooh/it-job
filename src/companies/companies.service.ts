import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Company, CompanyDocument } from "./schema/company.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CreateCompanyDto } from "./dto/create-company.dto";
import mongoose from "mongoose";
import aqp from "api-query-params";
import { isEmpty } from "class-validator";
import { IUser } from "src/interfaces/custom.interface";
@Injectable()
export class CompaniesService {
  // NOTE: Using SoftDeleteModel instead of Model to enable soft delete from soft-delete-plugin-mongoose
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: IUser,
  ): Promise<Company> {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  // EXAMPLE: for filter -- "/companies?page=1&limit=10&name=/ow/i"
  // -- the /ow/ is a regex -- which will check if the name contains "ow"
  // -- the /i/ is a flag -- which will make the regex case-insensitive
  // INFO: https://www.npmjs.com/package/api-query-params#supported-features -- for more info
  async findAll(current: number, pageSize: number, queryString: string) {
    const { filter, population } = aqp(queryString);
    let { sort } = aqp(queryString);
    delete filter.current; // delete this .page because we already have page from the function argument
    delete filter.pageSize; // delete this .pageSize because we already have limit from the function argument

    console.log(filter);

    let offset = (current - 1) * pageSize;
    let defaultLimit = pageSize ? pageSize : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    /* if (isEmpty(sort)) {
      sort.updatedAt = -1;
    } */

    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population);

    return {
      meta: {
        current, // trang hiện tại
        pageSize: defaultLimit, // số lượng item trên 1 trang
        pages: totalPages, // tổng số trang
        total: totalItems, // tổng số item
      },
      result,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },
      { ...updateCompanyDto, updatedBy: { _id: user._id, email: user.email } },
      {
        new: true,
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }

    await this.companyModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.companyModel.softDelete({
      _id: id,
    });
  }
}
