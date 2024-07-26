import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserIdentity, UserIdentitySchema } from "./useridentity.schema";
import { MulterModule } from "@nestjs/platform-express";
import { AuthModule } from "src/auth/auth.module";
import { UserIdentityController } from "./useridentity.controller";
import { UserIdentityService } from "./useridentity.service";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserIdentity.name, schema: UserIdentitySchema },
            
        ]),
        MulterModule.register({}),
        AuthModule,
        FilesModule,
    ],
    controllers: [UserIdentityController],
    providers: [UserIdentityService],
    exports: [UserIdentityService]
})
export class UserIdentityModule { }