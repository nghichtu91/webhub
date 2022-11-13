"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserSubscriber = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../entities/user.entity");
var UserSubscriber = /** @class */ (function () {
    function UserSubscriber(dataSource) {
        this.logger = new common_1.Logger(UserSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    UserSubscriber_1 = UserSubscriber;
    UserSubscriber.prototype.listenTo = function () {
        return user_entity_1.UserEntity;
    };
    UserSubscriber.prototype.beforeInsert = function (event) {
        this.logger.log("BEFORE USER INSERTED ".concat(JSON.stringify(event.entity)));
    };
    UserSubscriber.prototype.afterInsert = function (event) {
        this.logger.log("AFTER USER INSERTED ".concat(JSON.stringify(event.entity)));
    };
    var UserSubscriber_1;
    UserSubscriber = UserSubscriber_1 = __decorate([
        (0, typeorm_1.EventSubscriber)()
    ], UserSubscriber);
    return UserSubscriber;
}());
exports.UserSubscriber = UserSubscriber;
