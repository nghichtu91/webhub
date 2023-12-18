export interface IGiftcodeLogModel {
    id: number;
    username: string;
    value: number;
    code: string;
    createAt: Date;
}

export class GiftcodeLogModel implements IGiftcodeLogModel {
    id: number;
    username: string;
    value: number;
    code: string;
    createAt: Date;
}