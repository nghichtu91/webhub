import { SmsActions } from '@config';
import { IBaseModel } from '@shared';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ISmsDTO } from '../dto/sms.dto';

@Entity({ name: 'SMS' })
export class SmsEntity extends BaseEntity implements IBaseModel<ISmsDTO> {
  @Column({ name: 'acc', type: 'varchar' })
  userName: string;

  @Column({ name: 'KeyXuLy', type: 'varchar' })
  action: SmsActions;

  @Column({ name: 'time', type: 'int' })
  time: number;

  @Column({ name: 'status', type: 'tinyint' })
  status: number;

  @PrimaryColumn({ name: 'Code', type: 'int' })
  code: number;

  @Column({ name: 'dulieu1', type: 'varchar', length: 50 })
  info1?: string;
  @Column({ name: 'dulieu2', type: 'varchar', length: 50 })
  info2?: string;
  @Column({ name: 'dulieu3', type: 'varchar', length: 50 })
  info3?: string;
  @Column({ name: 'dulieu4', type: 'varchar', length: 50 })
  info4?: string;
  @Column({ name: 'dulieu5', type: 'varchar', length: 50 })
  info5?: string;
}
