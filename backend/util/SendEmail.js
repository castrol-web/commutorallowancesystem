import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//creation of the transport 
async function SendMail(email, subject, text) {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        //mail options from us to the user
        await transport.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        }).then(console.log("Email sent successfully!"));
        

    } catch (error) {
        console.log("Email not sent");
        console.log(error);
    }

}

export default SendMail;

