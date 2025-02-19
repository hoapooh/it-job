import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/guard/jwt-auth.guard";
import { TransformInterceptor } from "./interceptor/transform.interceptor";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);

  // NOTE: Set global prefix
  app.setGlobalPrefix("api");

  // NOTE: Set URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // NOTE: Setup JwtAuthGuard as a global guard
  // INFO: the JwtAuthGuard requires the Reflector class inside its constructor in order to work correctly
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // NOTE: Setup TransformInterceptor as a global interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // NOTE: Template engine
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("ejs");

  // NOTE: Setup CookieParser
  app.use(cookieParser());

  // NOTE: Setup global pipes for validation when using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // NOTE: Enable CORS for particular origin
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT");

  await app.listen(port ?? 3000);
}
bootstrap();
