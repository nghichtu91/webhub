import {
  BaseEntity,
  Column,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { IGiftcodeModel } from '../dtos/giftcode.model';
import { IBaseModel } from '@shared';

@Entity({ name: 'giftcodes' })
export class GiftcodeEntity
  extends BaseEntity
  implements IBaseModel<IGiftcodeModel>
{ 
  
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'int' })
  value: number;
  
  @CreateDateColumn({
    nullable: true,
    type: "datetime",
  })
  createAt: Date;

  @Column({ type: 'int', default: 0 })
  times: number;

  @Column({ type: 'datetime' })
  expired: Date;

  @UpdateDateColumn({
    nullable: true,
    type: "datetime",
  })
  updateAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.createAt = new Date()
  }

  isUse() {
    if(this.expired) {
      console.log(this.times , this.expired , new Date());
      return this.times >=0 && this.expired >= new Date()
    }
    return this.times >=0;
  }
}
