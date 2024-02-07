export interface IGiftcodeModel {
    id: number;
    code: string;
    category: string;
    value: number;
    times: number;
    expired: Date;
    createAt: Date;
    updateAt: Date;
}

export class GiftcodeModel implements IGiftcodeModel {
    expired: Date;
    times: number;
    createAt: Date;
    updateAt: Date;
    id: number;
    code: string;
    category: string;
    value: number;
}