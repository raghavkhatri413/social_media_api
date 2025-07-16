import nodemailer from "nodemailer";
import { getAllUsersInfo } from "../models/user.model.js";

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    ignoreTLS: true
});

const sendReminderEmail = async (user) => {
    const mailOptions = {
        from: '"Postify" khatriraghav2004@gmail.com',
        to: user.email,
        subject: 'New Posts are waiting!',
        text: `Hey ${user.username},\n\nCheck out the latest posts and join the conversation!`
    };

    await transporter.sendMail(mailOptions);
};

export const sendReminderEmailToAllUsers=async()=>{
    const users=await getAllUsersInfo();
    for(const user of users){
        try {
            await sendReminderEmail(user);
            console.log(`Email sent to ${user.email}`);
        } catch (error) {
            console.log("Error: ",error);
        }
    }
}