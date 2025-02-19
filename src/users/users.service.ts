import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import mongoose from "mongoose";
import { hashSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { RegisterUserDto } from "src/auth/dto/register.dto";
import { IUser } from "src/interfaces/custom.interface";
import aqp from "api-query-params";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  // NOTE: Using SoftDeleteModel instead of Model to enable soft delete from soft-delete-plugin-mongoose
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async register(registerUser: RegisterUserDto) {
    // CHECK EMAIL
    const userExists = await this.userModel.findOne({
      email: registerUser.email,
    });

    if (userExists) {
      throw new BadRequestException(
        `Email ${registerUser.email} already exists`,
      );
    }

    const hashedPassword = hashSync(registerUser.password, 10);
    const newUser = await this.userModel.create({
      ...registerUser,
      password: hashedPassword,
      role: "USER",
    });

    return newUser;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    // CHECK EMAIL
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new BadRequestException(
        `Email ${createUserDto.email} already exists`,
      );
    }

    const hashedPassword = hashSync(createUserDto.password, 10);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  // EXAMPLE: for filter -- "/companies?page=1&limit=10&name=/ow/i"
  // -- the /ow/ is a regex -- which will check if the name contains "ow"
  // -- the /i/ is a flag -- which will make the regex case-insensitive
  async findAll(current: number, pageSize: number, queryString: string) {
    const { filter, population } = aqp(queryString);
    let { sort } = aqp(queryString);
    delete filter.current; // delete this .page because we already have page from the function argument
    delete filter.pageSize; // delete this .pageSize because we already have limit from the function argument

    let offset = (current - 1) * pageSize;
    let defaultLimit = pageSize ? pageSize : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    /* if (isEmpty(sort)) {
      sort.updatedAt = -1;
    } */

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select("-password -__v -refreshToken");

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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }

    return await this.userModel.findById(id).select("-password -__v");
  }

  findOneByEmail(email: string) {
    const user = this.userModel.findOne({
      email,
    });

    return user;
  }

  isValidPassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }

    await this.userModel.findByIdAndUpdate(
      id,
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return this.userModel.softDelete({
      _id: id,
    });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
