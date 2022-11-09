"use strict";
exports.__esModule = true;
exports.appGlobalConfig = void 0;
var common_1 = require("@nestjs/common");
var cookie_parser_1 = require("cookie-parser");
function appGlobalConfig(app) {
    app.use((0, cookie_parser_1["default"])());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        validationError: { target: false }
    }));
}
exports.appGlobalConfig = appGlobalConfig;
