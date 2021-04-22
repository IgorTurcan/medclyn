import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { User } from '../models/User.js'
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

router.delete('/delete', auth,
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

        // const email = req.body.email;

        // for(const postId of req.user.postsIds) {
        //     const post = await Post.findOne({_id: postId});
        //     console.log('  '+post.title);
        //     for(const imageId of post.imagesIds) {
        //         const image = await Img.findOne({_id: imageId});
        //         console.log('    '+image.name);
        //     }
        // }

        await User.findOneAndDelete({ email });

        return res.status(201).json({message: 'User and his data deleted successfully!'});

    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

export { router };