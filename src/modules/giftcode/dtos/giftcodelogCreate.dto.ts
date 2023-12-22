import { IGiftcodeModel } from "./giftcode.model";

export interface IGiftcodelogCreateDto {
    username: string;
    value: number;
    code: string;
}

export class GiftcodelogCreateDto implements IGiftcodelogCreateDto {
    username: string;
    value: number;
    code: string;
    
    constructor(data: IGiftcodeModel, _username: string) {
        this.code = data.code;
        this.value = data.value;
        this.username = _username;
    }
}