import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GENDER } from 'src/enum/enum';
import { User } from 'src/user/user.schema';


export type UserIdentityDocument = HydratedDocument<UserIdentity>;

@Schema()
export class UserIdentity {
    @Prop({ type: Types.ObjectId, ref: 'User' }) 
    user: Types.ObjectId;

    @Prop({ default: false  })
    isPhotoLoaded: boolean;

    @Prop({ default: false  })
    isDetailGiven: boolean;

    @Prop({ default: new Date()  })
    createdUserDate: Date;

    @Prop({ default: GENDER.MALE, enum: GENDER})
    gender: GENDER;

    @Prop({default: 1})
    breast:number

    @Prop({ default: new Date()  })
    birthUserDate: Date;

}


export const UserIdentitySchema = SchemaFactory.createForClass(UserIdentity);