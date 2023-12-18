import {
  BaseEntity,
  Column,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'int' })
  value: number;
  
  @CreateDateColumn({
    nullable: true,
    type: "datetime",
  })
  createAt: Date;

  @Column({ type: 'int' })
  times: number;

  @Column({ type: 'datetime' })
  expired: Date;

  @UpdateDateColumn({
    nullable: true,
    type: "datetime",
  })
  updateAt: Date;
}
