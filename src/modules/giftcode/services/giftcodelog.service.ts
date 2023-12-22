import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Equal, Repository } from "typeorm";
import { GiftcodeLogEnity } from "../entities/giftcodelog.entity";
import { IGiftcodelogCreateDto } from "../dtos/giftcodelogCreate.dto";

interface IGiftcodelogService {
    create(createDto: IGiftcodelogCreateDto): Promise<GiftcodeLogEnity>;
    delete(id: number): Promise<DeleteResult>
    list(paged: number, pageSize: number, keyword?: string);
    check(code: string, username: string): Promise<boolean>;
}

@Injectable()
export class GiftcodelogService implements IGiftcodelogService {
    constructor(
        @InjectRepository(GiftcodeLogEnity)
        private giftcodelogRepo: Repository<GiftcodeLogEnity>,
    ) {

    }

    async check(code: string, username: string) {
        const t = await this.giftcodelogRepo.count({
            where: {
                code: Equal(code),
                username: Equal(username),
            }
        });
        return t > 0;
    }

    async list(paged: number, pageSize: number, keyword?: string) {
        let subSql = `SELECT ROW_NUMBER() OVER(ORDER BY id DESC) AS Numero, * FROM giftcodelogs`;
    
    const wheres: string[] = [];

    if (keyword != '' && keyword) {
        wheres.push('username LIKE @2');
      }

      if (wheres.length > 0) {
        subSql = `${subSql} WHERE ${wheres.join(' AND ')}`;
      }

    const sql = `SELECT id, code, value, createAt, username FROM (${subSql}) AS TBL
                WHERE Numero BETWEEN ((@0 - 1) * @1 + 1) AND (@0 * @1) 
            ORDER BY id DESC`;

    const s = await this.giftcodelogRepo
          .query(sql, [
              paged,
              pageSize,
              keyword ? `%${keyword}%` : '',
          ]);
      return s.map((c) => {
          return this.giftcodelogRepo.create(c);
      });
    }

    delete(id: number): Promise<DeleteResult> {
        return this.giftcodelogRepo.delete(id)
    }

    create(createDto: IGiftcodelogCreateDto) {
        const giftcodelogs = this.giftcodelogRepo.create(createDto);
        return this.giftcodelogRepo.save(giftcodelogs);
    } 

}