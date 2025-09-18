import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../user.repository';
import { IUser, ICreateUser } from '../../schemas/models/user.interface';
import { User } from '../../schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(userData: ICreateUser): Promise<IUser> {
    const user = new this.userModel(userData);
    const savedUser = await user.save(); // ← Middleware criptografa automaticamente

    return {
      id: savedUser._id.toString(),
      email: savedUser.email,
      password: savedUser.password,
      name: savedUser.name,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      password: updatedUser.password,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
