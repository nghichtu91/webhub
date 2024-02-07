import { InjectRepository } from '@nestjs/typeorm';
import { GiftcodeEntity } from '../entities/giftcode.entity';
import { Repository, DeleteResult, Equal, UpdateResult, Like, InsertResult, MoreThanOrEqual } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GiftcodeCreateDto, IGiftcodeCreateDto } from '@modules/giftcode/dtos/giftcodeCreate.dto';
import { IGiftcodeUpdateDto } from '../dtos/giftcodeUpdate.dto';
import { ISearchPaymentParams } from '@modules/payment/dtos';
import randomgift from 'randomstring';


interface IGiftcodeService {
  create(createDto: IGiftcodeCreateDto): Promise<GiftcodeEntity>;
  delete(id: number): Promise<DeleteResult>;
  update(id: number, updateDto: IGiftcodeUpdateDto): Promise<UpdateResult>;
  findByCode(code: string): Promise<number>;
  list(paged: number, pageSize: number, keyword?: string);
  getByCode(code: string): Promise<GiftcodeEntity>;
  updateTimes(id: number ):Promise<UpdateResult>;
  createRandom(createDto: GiftcodeCreateDto): Promise<InsertResult>;
}

@Injectable()
export class GiftcodeService implements IGiftcodeService {
  constructor(
    @InjectRepository(GiftcodeEntity)
    private giftcodeRepo: Repository<GiftcodeEntity>,
  ) {}

  updateTimes(id: number): Promise<UpdateResult> {
    return this.giftcodeRepo.update(
      {
        id: id,
      },
      {
        times: () => `times - 1`,
      }
    );
  }

  async getByCode(code: string): Promise<GiftcodeEntity> {
    const g = await this.giftcodeRepo.find({
      where: {
        code: code
      }
    });

    return g[0];
  }

  async list(paged = 1, pageSize = 12, keyword?: string) {
    let subSql = `SELECT ROW_NUMBER() OVER(ORDER BY id DESC) AS Numero, * FROM giftcodes`;
    
    const wheres: string[] = [];

    if (keyword != '' && keyword) {
        wheres.push('code LIKE @2');
      }

      wheres.push('times > 0');

      if (wheres.length > 0) {
        subSql = `${subSql} WHERE ${wheres.join(' AND ')}`;
      }

    const sql = `SELECT id, code, category, value, createAt, times, expired, updateAt FROM (${subSql}) AS TBL
                WHERE Numero BETWEEN ((@0 - 1) * @1 + 1) AND (@0 * @1) 
            ORDER BY id DESC`;

    const s = await this.giftcodeRepo
          .query(sql, [
              paged,
              pageSize,
              keyword ? `%${keyword}%` : '',
          ]);
      return s.map((c) => {
          return this.giftcodeRepo.create(c);
      });
  }

  findByCode(code: string) {
    return this.giftcodeRepo.count({
      where: {
        code: code,
      },
    });
  }

  update(id: number, updateDto: IGiftcodeUpdateDto): Promise<UpdateResult> {
    const updateEntity = this.giftcodeRepo.create(updateDto);
    return this.giftcodeRepo.update({ id: id }, updateEntity);
  }

  /**
   * @version v1.0.0.1
   * @description delete giftcode
   * @param {number} id
   * @returns {Promise<DeleteResult>}
   */
  delete(id: number): Promise<DeleteResult> {
    return this.giftcodeRepo.delete({ id: Equal(id) });
  }

  /**
   * @description create giftcode
   * @version v1.0.0.1
   * @author nhatthanh5891@gmail.com
   * @param {IGiftcodeCreateDto} createDto
   * @returns {Promise<GiftcodeEntity>}
   */
  create(createDto: IGiftcodeCreateDto): Promise<GiftcodeEntity> {
    const giftcode = this.giftcodeRepo.create(createDto);
    return this.giftcodeRepo.save(giftcode);
  }

  /**
   * @description create giftcode
   * @version v1.0.0.1
   * @author nhatthanh5891@gmail.com
   * @param {IGiftcodeCreateDto} createDto
   * @returns {Promise<GiftcodeEntity>}
   */
  createRandom({nums, value, cat }: GiftcodeCreateDto): Promise<InsertResult> {
    var giftcodes = []; 
    for(var i=0;  i <nums;  i++) {

      const gfRandom = randomgift.generate({
        length: 12,
        capitalization: 'lowercase'
      })

      const giftcodeEntity = this.giftcodeRepo.create({
        code: gfRandom,
        value: value, 
        times: 1,
        category: cat
      });

      giftcodes.push(giftcodeEntity);
    }

    return this.giftcodeRepo.insert(giftcodes);
  }

  async total(filter: ISearchPaymentParams): Promise<number> {
    const { keyword = '' } = filter;
    const where: any = {};

    if (keyword !== '' && keyword) {
      where.code = Like(`%${keyword}%`);
    }

    where.times = MoreThanOrEqual(1);

    return await this.giftcodeRepo.count({
      where: where,
    });
  }

}
