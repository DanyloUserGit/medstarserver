import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilesModule } from './files/files.module';
import { UserIdentityModule } from './userIdentity/useridentity.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: path.join(__dirname,'.env')}),
    ServeStaticModule.forRoot({
      serveRoot: "/uploads",
      rootPath: path.join(__dirname, '..', 'uploads'), 
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'build')
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get('MONGO_LINK');
        const appEnv = configService.get('APP_ENV');
        console.log(uri);
        
        return {
          uri,
          dbName: appEnv === 'DEV' ? 'med' :'medstar'
        };
      },
    }),
    UserModule,
    AuthModule,
    FilesModule,
    UserIdentityModule
  ],
})
export class AppModule {}
