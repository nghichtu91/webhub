export interface IGiftcodeLogModel {
    id: number;
    username: string;
    value: number;
    code: string;
    createAt: Date;
    cat?: string;
}

export class GiftcodeLogModel implements IGiftcodeLogModel {
    id: number;
    username: string;
    value: number;
    code: string;
    createAt: Date;
    cat?: string;
}