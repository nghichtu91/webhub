import { createHash } from 'node:crypto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUserModel } from '../dtos';
import { IBaseModel } from '@shared';
import {} from '@nestjs/typeorm';

@Entity({ name: 'Account_info' })
export class UserEntity extends BaseEntity implements IBaseModel<IUserModel> {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn({ name: 'iid', type: 'bigint' })
  id: string;

  @Column({
    type: 'varchar',
    name: 'cAccName',
  })
  userName: string;

  @Column({
    type: 'varchar',
    name: 'cEMail',
    length: 250,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'cPhone',
    length: 50,
    nullable: true,
  })
  phone?: string;

  @Column({
    name: 'cPassWord',
    length: 32,
    type: 'varchar',
  })
  passWord: string;

  @Column({
    name: 'cSecPassWord',
    length: 32,
    type: 'varchar',
  })
  passWordSecond: string;

  @CreateDateColumn({
    name: 'dRegDate',
    nullable: true,
    type: 'datetime',
  })
  createdAt?: Date;

  @BeforeInsert()
  createTime(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateTime(): void {
    this.updatedAt = new Date();
  }

  @UpdateDateColumn({ name: 'cUpdateInfo', nullable: true, type: 'datetime' })
  updatedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(): void {
    if (this.passWord) {
      this.passWord = createHash('md5').update(this.passWord).digest('hex');
    }
    if (this.passWordSecond) {
      this.passWordSecond = createHash('md5')
        .update(this.passWordSecond)
        .digest('hex');
    }
  }

  // point
  @Column({
    type: 'smallint',
    name: 'nExtPoint',
    insert: true,
  })
  point = 1;

  @Column({
    type: 'smallint',
    name: 'nExtPoint1',
    default: 0,
  })
  point1 = 0;

  @Column({
    type: 'smallint',
    name: 'nExtPoint2',
    default: 0,
  })
  point2 = 0;

  @Column({
    type: 'smallint',
    name: 'nExtPoint3',
    default: 0,
  })
  point3 = 0;

  @Column({
    type: 'smallint',
    name: 'nExtPoint4',
    default: 0,
  })
  point4 = 0;

  @Column({
    type: 'smallint',
    name: 'nExtPoint5',
    default: 0,
  })
  point5 = 0;

  @Column({
    type: 'smallint',
    name: 'nExtPoint6',
    default: 0,
  })
  point6 = 0;

  @Column({
    type: 'smallint',
    name: 'nExtPoint7',
    default: 0,
  })
  point7 = 0;

  comparePassword(attempt: string): boolean {
    return (
      createHash('md5').update(attempt).digest('hex').toString() ===
      this.passWord
    );
  }
}
