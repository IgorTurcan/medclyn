import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/sendEmail',
    async (req, res) => {
    try {
        const name = req.body.name;
        const subject = req.body.subject;
        const email = req.body.email;
        const message = req.body.message;

        const user = {
            email: process.env.EMAIL || '---',
            pass: process.env.PASS || '---'
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: user.email,
              pass: user.pass
            }
          });
          
        const mailOptions = {
            from: user.email,
            to: user.email,
            subject: subject,
            text: `Name: ${name}\nEmail: ${email}\n${message}`
        };
          
        transporter.sendMail(mailOptions, (err) => {
            if(err) throw(err);
            else {
                return res.status(201).json({message: 'Message sended successfully!'});
            }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

export { router };