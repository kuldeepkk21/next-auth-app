import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/userModel';


export const sendEmail = async ({email, emailType, userId}: any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, 
                { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
            );
        } else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
            );
        } else {
            throw new Error("Email type is not valid");
        }

        const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "6a2e2fa7b49d2b",
            pass: "****f7d4"
        }
        });

        const info = await transport.sendMail({
            from: "kelly@gmail.com", 
            to: email, 
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", 
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to 
            ${emailType === "VERIFY" ? "verify your email" : 
            "reset your password"} or copy and paste the below link in your browser.
            <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        });

        return info;
    } catch (error: any) {
        throw new Error(error.message);
    }
};