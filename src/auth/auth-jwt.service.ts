import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { JwtService } from '@nestjs/jwt';
import { ROLES } from "src/enum/enum";
import { Authentication } from './auth.schema';

@Injectable()
export class JwtTokenService {
    constructor(
        @InjectModel(Authentication.name) private authModel: Model<Authentication>,
        private readonly jwtService: JwtService,
    ) { }

    generateTokens(payload: { email: string; role: ROLES; id: string }) {
        const accessToken = this.jwtService.sign(
            payload,
            { expiresIn: '10s' },
        );
        const refreshToken = this.jwtService.sign(
            payload,
            { expiresIn: '3000000s' },
        );
        return {
            accessToken,
            refreshToken,
        };
    }

    validateAccessToken(token) {
        try {
            const userData = this.jwtService.verify(token);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = this.jwtService.verify(token);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await this.authModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await this.authModel.create({ user: userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await this.authModel.deleteOne({ refreshToken });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await this.authModel.findOne({ refreshToken });
        return tokenData;
    }

    async deleteToken(_id: string | Types.ObjectId ) {
        try {
            const userId = new Types.ObjectId(_id);
            await this.authModel.deleteOne({ user: userId })
        } catch (error) {
            throw error
        }
    }
}
