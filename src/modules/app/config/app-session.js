"use strict";
exports.__esModule = true;
exports.configSession = void 0;
var express_session_1 = require("express-session");
var parse_duration_1 = require("parse-duration");
var passport_1 = require("passport");
var flash = require("connect-flash");
function configSession(app) {
    app.use((0, express_session_1["default"])({
        resave: false,
        saveUninitialized: false,
        secret: 'hubweb',
        cookie: {
            secure: false,
            httpOnly: false,
            maxAge: (0, parse_duration_1["default"])('50', 'd')
        }
    }));
    app.use(passport_1["default"].initialize());
    app.use(passport_1["default"].session());
    app.use(flash());
}
exports.configSession = configSession;
