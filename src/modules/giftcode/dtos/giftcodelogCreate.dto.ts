import { IGiftcodeModel } from "./giftcode.model";

export interface IGiftcodelogCreateDto {
    username: string;
    value: number;
    code: string;
    cat?: string;
}

export class GiftcodelogCreateDto implements IGiftcodelogCreateDto {
    username: string;
    value: number;
    code: string;
    cat?: string;

    constructor(data: IGiftcodeModel, _username: string, cat?: string) {
        this.code = data.code;
        this.value = data.value;
        this.username = _username;
        this.cat = cat;
    }
}