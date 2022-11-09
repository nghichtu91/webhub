"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var controllers_1 = require("./controllers");
var services_1 = require("./services");
var user_module_1 = require("../user/user.module");
var auth_module_1 = require("../auth/auth.module");
var entities_1 = require("../user/entities");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'mssql',
                    host: '103.92.24.185',
                    username: 'sa',
                    password: 'Long@Huy@JX1@bbz',
                    synchronize: false,
                    options: { encrypt: false },
                    entities: [entities_1.UserEntity],
                    database: 'account_tong'
                }),
                auth_module_1.AuthModule,
                user_module_1.UsersModule,
            ],
            controllers: [controllers_1.AppController],
            providers: [services_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
