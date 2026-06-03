import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllUsers() {
    const users = await this.usersRepository.find({
      relations: ['roles'],
      select: { email: true, id: true, roles: true },
    });

    return users;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: { email: true, id: true, roles: true },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new ConflictException(`User: ${updateUserDto.email} Not found`);
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

      const updateUser = await this.usersRepository.preload({
        id: user.id,
        ...updateUserDto,
        roles: updateUserDto.roles?.map((id) => ({ id })) ?? [],
        password: hashedPassword,
      });

      if (!updateUser) {
        throw new ConflictException(`Role preload failed`);
      }

      // console.log(updateUser);

      return await this.usersRepository.save(updateUser);
    } else {
      const updateUser = await this.usersRepository.preload({
        id: user.id,
        ...updateUserDto,
        roles: updateUserDto.roles?.map((id) => ({ id })) ?? [],
      });

      if (!updateUser) {
        throw new ConflictException(`Role preload failed`);
      }

      return await this.usersRepository.save(updateUser);
    }
  }
}
