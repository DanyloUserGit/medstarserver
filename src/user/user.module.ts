import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { MulterModule } from "@nestjs/platform-express";
import { AuthModule } from "src/auth/auth.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            
        ]),
        MulterModule.register({}),
        AuthModule,
        FilesModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }