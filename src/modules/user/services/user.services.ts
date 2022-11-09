import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findByUserName(userName: string) {
    return this.userRepository.find({
      where: { userName: userName },
    });
  }

  async phoneIsExist(phone: string) {
    const phoneNumber = await this.userRepository.count({
      where: {
        phone: phone,
      },
    });
    return phoneNumber === 0;
  }

  async userNameIsExist(username: string) {
    const userNameNumber = await this.userRepository.count({
      where: {
        userName: username,
      },
    });
    return userNameNumber === 0;
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    try {
      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(
        `${err.detail}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
