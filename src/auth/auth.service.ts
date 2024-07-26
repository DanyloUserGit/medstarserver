import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { METHOD_FORGET_PASSWORD, METHOD_REGISTRATION } from 'src/enum/enum';
import { MailService } from 'src/mail/mail.service';
import { generateRandomFourDigitCode } from 'src/utils/utils';
import { User } from '../user/user.schema';
import { JwtTokenService } from './auth-jwt.service';
import { AddDetailsDto, AuthDto, ConfirmCodeEmailDTO, RegistrationDto } from './auth.dto';
import { UserIdentity } from 'src/userIdentity/useridentity.schema';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserIdentity.name)
        private readonly userIdentityModel: Model<UserIdentity>,
        private jwtTokenService: JwtTokenService,
        private mailService: MailService,
        private filesService: FilesService,
    ) { }

    async registration({ email, password, fullName }: RegistrationDto) {

        try {

            const candidate = await this.userModel.findOne({ email }).select('-isValidationUser -password');

            if (candidate) {
                throw new HttpException(
                    `User ${email} already created`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const hashPassword = await bcrypt.hash(password, 3);
            const codeCheck = generateRandomFourDigitCode()

            const user = await this.userModel.create({
                email,
                password: hashPassword,
                fullName,
                codeCheck,
            })
            await this.regenereteCodeByEmail({ email})
            

            const { role, id } = user;

            await this.userIdentityModel.create({user:new Types.ObjectId(id)})

            const userObject = user.toObject();

            delete userObject.password
            delete userObject.codeCheck

            return { ...userObject };
        } catch (error) {
            throw error
        }

    }

    async login({ email, password, methodRegistration = METHOD_REGISTRATION.JWT }: AuthDto) {
        const user = await this.userModel.findOne({ email }).select('-isValidationUser');
        if (!user) {
            throw new HttpException(
                `User ${email} not found`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!isPassEquals && methodRegistration === METHOD_REGISTRATION.JWT) {
            throw new HttpException(`Bad password`, HttpStatus.BAD_REQUEST);
        }
        const { role, id, isCheckedEmail } = user;

        if (!isCheckedEmail) {
            await this.regenereteCodeByEmail({ email })
        }

        const userObject = user.toObject();

        delete userObject.codeCheck
        delete userObject.password

        return { ...userObject};
    }

    async addPhoto({
        _id,
         file
        }:{
            _id:string,
            file:Express.Multer.File
        }){
        try {
            const fileName = await this.filesService.uploadSingleFile(file, 'uploads/photos');
            const user = await this.userModel.findOne({_id:new Types.ObjectId(_id)});

            await this.userIdentityModel.updateOne({user:new Types.ObjectId(_id)}, {isPhotoLoaded:true})
            await user.updateOne({photoFileName:fileName})

            return {...user}
        } catch (error) {
            console.log(error)
        }
    }

    async addDetails(body:AddDetailsDto){
        try {
            const {gender, breast, birthDate, _id} = body;
            
            await this.userIdentityModel.updateOne({user:new Types.ObjectId(_id)}, {gender, breast, birthUserDate:birthDate, isDetailGiven:true})

            const user = await this.userModel.findOne({_id:new Types.ObjectId(body._id)})
            .populate({
                path: "identity"
            })

            return {...user}
        } catch (error) {
            console.log(error)
        }
    }

    async logout(refreshToken: string) {
        const token = await this.jwtTokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new HttpException(`UNAUTHORIZED`, HttpStatus.UNAUTHORIZED);
        }
        const userData = this.jwtTokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.jwtTokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw new HttpException(`UNAUTHORIZED`, HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userModel.findById(userData.id).select('-isValidationUser -password -codeCheckEmail');
        const { role, id, email } = user;
        const tokens = this.jwtTokenService.generateTokens({ email, role, id });

        await this.jwtTokenService.saveToken(id, tokens.refreshToken);
        return { ...tokens, user };
    }

    async regenereteCodeByEmail({ email }: { email: string}) {
        try {
            const user = await this.userModel.findOne({ email })
            const codeCheck = generateRandomFourDigitCode()
            await user.updateOne({ codeCheck })

            this.sendCodeEmailMessage({ email, codeCheck })
            return
        } catch (error) {
            throw new error
        }

    }

    async sendCodeEmailMessage({ email, codeCheck }: { email: string, codeCheck: number }) {
        await this.mailService.sendMail({
            to: email,
            subject: 'Your verification code to Medstar',
            text: `Your code ${codeCheck}, please input code in field`
        })
    }

    async confirmAccount({ _id, code }: ConfirmCodeEmailDTO) {
        try {
            const user = await this.userModel.findOne({ _id })

            if (user.codeCheck !== code) {
                throw new HttpException(`Bad code`, HttpStatus.BAD_REQUEST);
            }

            await user.updateOne({
                isCheckedEmail: true
            })

            return {
                isCheckedEmail: true
            }
        } catch (error) {
            throw new Error(error)
        }

    }

    // async forgetPassword({ email, code }: ConfirmCodeEmailDTO) {
    //     try {
    //         const user = await this.userModel.findOne({ email })

    //         if (user.codeCheck !== code) {
    //             throw new HttpException(`Bad code`, HttpStatus.BAD_REQUEST);
    //         }

    //         return { hashPassword: user.password }
    //     } catch (error) {
    //         throw new Error(error)
    //     }


    // }

    async changePassword({ email, oldPassword, hashPassword, newPassword }: { email: string, oldPassword?: string, hashPassword?: string, newPassword: string }) {
        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new HttpException(
                `User not found`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const password = await bcrypt.hash(newPassword, 3);

        if (hashPassword && hashPassword === user.password) {
            await user.updateOne({ password })
            return
        }

        const isPassEquals = await bcrypt.compare(oldPassword, user.password);

        if (!isPassEquals) {
            throw new HttpException('Bad password', HttpStatus.BAD_REQUEST)
        }

        await user.updateOne({ password })
        return

    }


}
