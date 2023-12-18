import { IBaseModel } from "@shared";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IGiftcodeLogModel } from "../dtos/giftcodelogs.model";

@Entity({ name: 'giftcodelogs' })
export class GiftcodeLogEnity extends BaseEntity implements IBaseModel<IGiftcodeLogModel> {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({ name: 'id', type: 'int' })
    id: number;
    
    @Column({ type: 'varchar' })
    username: string;

    @Column({ type: 'int' })
    value: number;

    @Column({ type: 'varchar' })
    code: string;

    @CreateDateColumn({
        nullable: true,
        type: "datetime",
    })
    createAt: Date;
}