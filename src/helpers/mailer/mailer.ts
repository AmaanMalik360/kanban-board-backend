import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'amaanmalik0360@gmail.com',
        pass: 'vgsj mcpu pjxa aotb',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    const options = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: html
    }

    await this.transporter.sendMail(options);
  }
}