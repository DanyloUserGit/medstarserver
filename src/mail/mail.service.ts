import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();


@Injectable()
export class MailService {
    private transporter: any;

    constructor() {

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_ADDRESS,
                pass:process.env.APP_PASSWORD
            },
        });
    }

    async sendMail({
        to,
        subject,
        text,
    }: {
        to: string;
        subject: string;
        text: string;
      } ) {
        console.log("sendMail");
        
        const mailOptions = {
            from: {
                name:process.env.APP_NAME,
                address:process.env.GMAIL_ADDRESS
            },
            to,
            subject,
            text,
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    
                    reject(error);
                } else {
                    console.log(info);
                    
                    resolve(info.response);
                }
            });
        });
    }
}