"use strict";
exports.__esModule = true;
exports.devConfig = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var package_json_1 = require("../../../../package.json"); // Notice: the packages.json will be added to dist folder
var morgan_1 = require("morgan");
/**
 * Application config for development environment
 * @param app
 */
function devConfig(app) {
    var logger = new common_1.Logger('Bootstrap');
    app.enable('trust proxy');
    app.enableCors();
    app.use((0, morgan_1["default"])('short'));
    app.disable('view cache');
    var swaggerBuilder = new swagger_1.DocumentBuilder()
        .setTitle('jx1 portal')
        .setDescription(package_json_1.description)
        .addBearerAuth();
    swaggerBuilder = swaggerBuilder.setVersion(package_json_1.version);
    var swaggerConfig = swaggerBuilder.build();
    var docs = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('/docs', app, docs); // Notice: Route to http://API_URL:PORT/docs-json to get Swagger json-docs
    logger.debug("Swagger docs: docs");
    logger.debug("Swagger-JSON file: /docs-json");
}
exports.devConfig = devConfig;
