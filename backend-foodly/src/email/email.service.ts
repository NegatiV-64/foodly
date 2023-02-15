import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
    constructor(private configService: ConfigService) { }

    public async sendEmail(emailTo: string, verficationCode: number, expiryDate: string) {
        const emailSender = this.configService.get('EMAIL_SENDER') as string;
        const mailTransport = this.createMailTransport();

        try {
            await mailTransport.sendMail({
                from: `Foodly Bot <${emailSender}>`,
                to: `${emailTo}`,
                subject: 'Verify your registration',
                html: `
                <div>
                    <h2>Hello!</h2>
                    <p>Please, verify your order with with following code: <code>${verficationCode}<code/></p>
                    <p>Verify your order within 5 minutes, unless it would expire</p>
                    <p>You can use this code until: ${expiryDate}</p>
                </div>
                `
            });
        } catch (error) {
            let errorMessage = 'Error happened on seding email';

            if (error instanceof Error && error.message.trim().length > 0) {
                errorMessage = error.message;
            }
            throw new InternalServerErrorException(errorMessage);
        }
    }

    protected createMailTransport() {
        const emailProvider = this.configService.get('EMAIL_PROVIDER') as string;
        const emailSender = this.configService.get('EMAIL_SENDER') as string;
        const emailPassword = this.configService.get('EMAIL_PASSWORD') as string;

        const mailTransport = createTransport({
            host: emailProvider,
            port: 465,
            secure: true,
            auth: {
                user: emailSender,
                pass: emailPassword,
            }
        });

        return mailTransport;
    }
}
