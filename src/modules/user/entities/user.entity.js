"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserEntity = void 0;
var node_crypto_1 = require("node:crypto");
var typeorm_1 = require("typeorm");
var UserEntity = /** @class */ (function (_super) {
    __extends(UserEntity, _super);
    function UserEntity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // point
        _this.point = 1;
        _this.point1 = 0;
        _this.point2 = 0;
        _this.point3 = 0;
        _this.point4 = 0;
        _this.point5 = 0;
        _this.point6 = 0;
        _this.point7 = 0;
        return _this;
    }
    UserEntity.prototype.createTime = function () {
        this.createdAt = new Date();
    };
    UserEntity.prototype.updateTime = function () {
        this.updatedAt = new Date();
    };
    UserEntity.prototype.hashPassword = function () {
        if (this.passWord) {
            this.passWord = (0, node_crypto_1.createHash)('md5').update(this.passWord).digest('hex');
        }
        if (this.passWordSecond) {
            this.passWordSecond = (0, node_crypto_1.createHash)('md5')
                .update(this.passWordSecond)
                .digest('hex');
        }
    };
    UserEntity.prototype.comparePassword = function (attempt) {
        return ((0, node_crypto_1.createHash)('md5').update(attempt).digest('hex').toString() ===
            this.passWord);
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
        (0, typeorm_1.PrimaryColumn)({ name: 'iid', type: 'bigint' })
    ], UserEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar',
            name: 'cAccName'
        })
    ], UserEntity.prototype, "userName");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar',
            name: 'cEMail',
            length: 250,
            nullable: true
        })
    ], UserEntity.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar',
            name: 'cPhone',
            length: 50,
            nullable: true
        })
    ], UserEntity.prototype, "phone");
    __decorate([
        (0, typeorm_1.Column)({
            name: 'cPassWord',
            length: 32,
            type: 'varchar'
        })
    ], UserEntity.prototype, "passWord");
    __decorate([
        (0, typeorm_1.Column)({
            name: 'cSecPassWord',
            length: 32,
            type: 'varchar'
        })
    ], UserEntity.prototype, "passWordSecond");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            name: 'dRegDate',
            nullable: true,
            type: 'datetime'
        })
    ], UserEntity.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.BeforeInsert)()
    ], UserEntity.prototype, "createTime");
    __decorate([
        (0, typeorm_1.BeforeUpdate)()
    ], UserEntity.prototype, "updateTime");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'cUpdateInfo', nullable: true, type: 'datetime' })
    ], UserEntity.prototype, "updatedAt");
    __decorate([
        (0, typeorm_1.BeforeInsert)(),
        (0, typeorm_1.BeforeUpdate)()
    ], UserEntity.prototype, "hashPassword");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint',
            insert: true
        })
    ], UserEntity.prototype, "point");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint1',
            "default": 0
        })
    ], UserEntity.prototype, "point1");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint2',
            "default": 0
        })
    ], UserEntity.prototype, "point2");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint3',
            "default": 0
        })
    ], UserEntity.prototype, "point3");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint4',
            "default": 0
        })
    ], UserEntity.prototype, "point4");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint5',
            "default": 0
        })
    ], UserEntity.prototype, "point5");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint6',
            "default": 0
        })
    ], UserEntity.prototype, "point6");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'smallint',
            name: 'nExtPoint7',
            "default": 0
        })
    ], UserEntity.prototype, "point7");
    UserEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'Account_info' })
    ], UserEntity);
    return UserEntity;
}(typeorm_1.BaseEntity));
exports.UserEntity = UserEntity;
