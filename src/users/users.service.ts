import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import mongoose, { FilterQuery, Model } from "mongoose";
import { hashSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class UsersService {
  // NOTE: Using SoftDeleteModel instead of Model to enable soft delete from soft-delete-plugin-mongoose
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async create(query: FilterQuery<User>): Promise<User> {
    const hashedPassword = hashSync(query.password, 10);

    return this.userModel.create({
      ...query,
      password: hashedPassword,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }

    const user = this.userModel.findById(id);

    return user;
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }

    return this.userModel.softDelete({
      _id: id,
    });
  }
}
