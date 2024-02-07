import { IBaseModel } from "@shared";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({ type: 'varchar' })
    cat: string;

    @CreateDateColumn({
        nullable: true,
        type: "datetime",
    })
    createAt: Date;

    @BeforeInsert()
    beforeinsert() {
        this.createAt = new Date();
    }
}