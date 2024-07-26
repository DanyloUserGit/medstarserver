import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { GENDER } from "src/enum/enum";


export class UserDetailsDto{
    @IsString()
    _id:string
}