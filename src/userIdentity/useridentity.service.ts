import { InjectModel } from "@nestjs/mongoose";
import { UserIdentity } from "./useridentity.schema";
import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { FilesService } from "src/files/files.service";
import { UserDetailsDto } from "./useridentity.dto";

@Injectable()
export class UserIdentityService {

    constructor(
        @InjectModel(UserIdentity.name)
        private readonly userIdentityModel: Model<UserIdentity>,
        private readonly filesService: FilesService,
    ) { }

    // async updatePhotoStatus(file: Express.Multer.File, _id: string){
    //     try {
    //         const userId = new Types.ObjectId(_id)
    //         let user = await this.userIdentityModel.findOne({ user: userId })

    //         if(user.photoFileName){
    //             await this.filesService.deleteFile(user.photoFileName, 'uploads/photos')
    //         }

    //         const uploadedFile = await this.filesService.uploadFiles([file], 'uploads/photos', false)

    //         const photoFileName = uploadedFile;

    //         await user.updateOne({isPhotoLoaded:true})
    //         await user.updateOne({ photoFileName })
    //         return { photoFileName }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async getProfileInfo(body:UserDetailsDto){
        try {
            const _id = new Types.ObjectId(body._id);
            const user = await this.userIdentityModel.findOne({user:_id}).lean()
            .populate({
                path:'user'
            })
            return {...user};
        } catch (error) {
            throw error;
        }
    }
}