import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop({ enum: ["male", "female"], default: "male" })
  gender: string;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  company: {
    _id: MongooseSchema.Types.ObjectId;
    name: string;
  };

  @Prop()
  role: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: Object })
  createdBy: {
    _id: MongooseSchema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: MongooseSchema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: MongooseSchema.Types.ObjectId;
    email: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
