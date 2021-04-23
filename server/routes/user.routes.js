import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Img } from '../models/Img.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import path from 'path';

const router = express.Router();
const __dirname = path.resolve();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,'static/register.html'));
});

router.post('/register', 
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({min:5, max:30}),
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data on register!'
            });
        }

        const email = req.body.email;
        const password = req.body.password;

        const candidate = await User.findOne({ email });

        if(candidate) {
            return res.status(400).json({message: 'This user already exists!'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        
        return res.status(201).json({message: 'User registered successfully!'});

    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'static/login.html'));
});

router.post('/login', auth,
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({min:5, max:30}),
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data on register!', 
                auth: 'false'
            });
        }

        return res.status(200).json({
            message: 'User logged in successfully!',
            auth: 'true'
        });

    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', auth: 'false', error: `${e}`});
    }
});

router.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname,'static/deleteUser.html'));
});

router.delete('/delete/:email',
    async (req, res) => {
    try {
        const email = req.params.email;

        if(!email) {
            return res.status(400).json({message: 'No such user!'});
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({message: 'No such user!'});
        } else {
            for(const postId of user.postsIds) {
                const post = await Post.findOne({_id: postId});
                for(const imageId of post.imagesIds) {
                    await Img.findOneAndDelete({_id: imageId});
                }
                await Post.findOneAndDelete({_id: postId});
            }
            await User.findOneAndDelete({ email });
        }

        return res.status(201).json({message: 'User and his data deleted successfully!'});

    } catch (e) {
        console.log(e);
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

export { router };