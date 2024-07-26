import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { UserIdentityService } from "./useridentity.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UserDetailsDto } from "./useridentity.dto";

@Controller('useridentity')
export class UserIdentityController{
    constructor(private readonly userIdentityService: UserIdentityService) { }

    
    // @Post('upload-photo')
    // @UseInterceptors(FilesInterceptor('file'))
    // async profileUploadPhoto(
    //     @Body() body,
    //     @UploadedFile() file:Express.Multer.File,
    // ) {
    //     const userId = JSON.parse(body.payload)?._id
    //     return await this.userIdentityService.updatePhotoStatus(file, userId)
    // }

    @Post('get-identity')
    async getProfileInfo(
        @Body() body:UserDetailsDto,
    ) {
        return await this.userIdentityService.getProfileInfo(body)
    }
}