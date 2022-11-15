import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from '../dtos/create.dto';
import { ChangePassWordDTO, UpdateUserDTO } from '../dtos';
import { createHash } from 'node:crypto';

@Injectable()
export class UserService {
  private loger = new Logger(UserService.name);
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

  async getUser(userName: string) {
    const users = await this.userRepository.query(
      `select * from Account_Info where cAccName = @0`,
      [userName],
    );
    return users[0];
  }
  /**
   *
   * @param userName
   * @param data
   * @returns
   */
  update(userName: string, data: UpdateUserDTO) {
    const ff = this.userRepository.update(
      {
        userName: userName,
      },
      data,
    );
    return ff;
  }

  /**
   * @class UserService
   * @author nhatthanh5891
   * @description cập nhật lại mật khẩu của tài khoản.
   * @param {string} userName
   * @param {ChangePassWordDTO} data
   * @returns {Promise<UpdateResult>}
   */
  async changePassword(
    userName: string,
    data: ChangePassWordDTO,
  ): Promise<UpdateResult> {
    const passwordMd5 = createHash('md5').update(data.passWord).digest('hex');
    const updatePassword = this.userRepository.update(
      {
        userName: userName,
      },
      { passWord: passwordMd5 },
    );
    return updatePassword;
  }

  /**
   *
   * @param {string} userName
   * @param  {number} money
   * @returns
   */
  addMoney(userName: string, money: number) {
    this.loger.log('addMoney');
    const adding = this.userRepository.update(
      {
        userName: userName,
      },
      {
        point1: () => `nExtPoint1 + ${money}`,
      },
    );
    return adding;
  }
}
