import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Redirect,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AddDetailsDto, AuthDto, ChangePAsswordDTO, ConfirmCodeEmailDTO, EmailDTO, RegenerateCodeEmailDTO, RegistrationDto } from './auth.dto';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private configService: ConfigService
    ) { }

    @Post('registration')
    async registration(
        @Body() authDto: RegistrationDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.registration(authDto);

        return result;
    }

    @Post('login')
    async login(
        @Body() authDto: AuthDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.login(authDto);
        // res.cookie('refreshToken', result.refreshToken, {
        //     maxAge: 30 * 24 * 60 * 60 * 1000,
        //     httpOnly: true,
        // });

        return result;
    }

    // @Post('refresh')
    // async refresh(
    //     @Req() req: Request,
    //     @Res({ passthrough: true }) res: Response,
    // ) {
    //     const { refreshToken } = req?.cookies;
    //     const result = await this.authService.refresh(refreshToken);
    //     res.cookie('refreshToken', result.refreshToken, {
    //         maxAge: 30 * 24 * 60 * 60 * 1000,
    //         httpOnly: true,
    //     });

    //     return result;
    // }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { refreshToken } = req.cookies;
        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return 'LOGOUT';
    }

    @Post('regenerete-code-email')
    async regenereteCodeByEmail(
        @Body() body: RegenerateCodeEmailDTO
    ){
        return await this.authService.regenereteCodeByEmail(body)
    }

    @Post('confirm')
    async confirmAccount(
        @Body() body: ConfirmCodeEmailDTO
    ){
        return await this.authService.confirmAccount(body)
    }

    @Post('add-photo')
    @UseInterceptors(FileInterceptor('file'))
    async addPhoto(
        @Body() body,
        @UploadedFile() file: Express.Multer.File
    ){
        const {
            _id,
        }: {
            _id: string;
        } = JSON.parse(body.payload);
        
        return await this.authService.addPhoto({ _id, file })
    }

    @Post('add-details')
    async addDetails(
        @Body() body: AddDetailsDto
    ){
        return await this.authService.addDetails(body)
    }

    // @Post('forget-password') 
    //  async forgetPassword(
    //    @Body() body: ConfirmCodeEmailDTO
    // ){
    //     return await this.authService.forgetPassword(body)
    // }

    @Post('change-password') 
     async changePassword(
       @Body() body: ChangePAsswordDTO
    ){
        return await this.authService.changePassword(body)
    }
    

}
