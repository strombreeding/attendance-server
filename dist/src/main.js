"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const utilFuc_1 = require("./utils/utilFuc");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(3001);
    console.log((0, utilFuc_1.getNowWeek)());
}
bootstrap();
//# sourceMappingURL=main.js.map