import { InjectRepository } from "@nestjs/typeorm";
import { GiftcodeEntity } from "../entities/giftcode.entity";
import { Repository } from "typeorm";

interface IGiftcodeService {
   create(): Promise<GiftcodeEntity> 
}

export class GiftcodeService implements IGiftcodeService {

    constructor(
        @InjectRepository(GiftcodeEntity)
        private paymentRepo: Repository<GiftcodeEntity>,
    ) {}
    create(): Promise<GiftcodeEntity> {
        throw new Error("Method not implemented.");
    }
}