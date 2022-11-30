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
      const inserted = await this.userRepository.save(user);
      // const playtime = this.playtimeRepository.create({
      //   userName: inserted.userName,
      // });
      // this.playtimeRepository.save(playtime);
      return inserted;
    } catch (err) {
      throw new HttpException(
        `${err.detail}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(userName: string) {
    const users = await this.userRepository.find({
      select: ['point1', 'id', 'userName', 'updateInfo'],
      where: {
        userName: userName,
      },
    });
    return users[0];
  }
  /**
   *
   * @param userName
   * @param data
   * @returns
   */
  update(userName: string, data: UpdateUserDTO) {
    const userDto = this.userRepository.create(data);
    console.log('userDto', userDto);
    const ff = this.userRepository.update(
      {
        userName,
      },
      userDto,
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
  async addMoney(userName: string, money: number) {
    try {
      this.loger.log(`[addMoney] cộng vào tài khoản ${userName} ${money} xu!`);
      const adding = await this.userRepository.update(
        {
          userName: userName,
        },
        {
          point1: () => `nExtPoint1 + ${money}`,
        },
      );
      return adding;
    } catch (e) {
      this.loger.error('[addMoney] có lỗi cộng xu.');
      throw new Error('Có lỗi cộng xu');
    }
  }
}
