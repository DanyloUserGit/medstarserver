import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { METHOD_REGISTRATION, ROLES } from 'src/enum/enum';
import { UserIdentity } from 'src/userIdentity/useridentity.schema';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ type: Types.ObjectId, ref: 'UserIdentity' }) 
    identity: Types.ObjectId;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: false })
    isCheckedEmail: boolean;

    @Prop({default: 0})
    codeCheck: number;

    @Prop({ default: "" })
    fullName: string;

    @Prop({ default: ROLES.USER, enum: ROLES})
    role: ROLES;

    @Prop({type: String, default: null})
    photoFileName:string | null
}

export const UserSchema = SchemaFactory.createForClass(User);