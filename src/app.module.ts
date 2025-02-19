import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { CompaniesModule } from "./companies/companies.module";
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        dbName: "itjobs",
        // NOTE: softDeletePlugin is a plugin that we created to handle soft delete functionality in MongoDB with deleteAt and isDeleted fields
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService], // this is an injector that allows us to inject the ConfigService into the useFactory function so that we can access the configuration values
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    UsersModule,
    AuthModule,
    CompaniesModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
