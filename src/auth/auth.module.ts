import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/user.schema";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtTokenService } from "./auth-jwt.service";
import { Authentication, AuthenticationSchema } from "./auth.schema";
import { MailModule } from "src/mail/mail.module";
import { UserIdentity, UserIdentitySchema } from "src/userIdentity/useridentity.schema";
import { MulterModule } from "@nestjs/platform-express";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            { name: Authentication.name, schema: AuthenticationSchema },
            { name: User.name, schema: UserSchema },
            { name: UserIdentity.name, schema: UserIdentitySchema },
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get('JWT_SECRET');
                return {
                    secret,
                };
            },
        }),
        MailModule,
        FilesModule,
        MulterModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AuthService,
        JwtTokenService,
        
    ],
    exports: [
        JwtTokenService
    ]
})
export class AuthModule { }