import express from 'express';
import fs from 'fs';
import { connectDB, endCon, getCon } from '../db.js'
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import path from 'path';
import config from 'config';
import jwt from 'jsonwebtoken';

const router = express.Router();
const __dirname = path.resolve();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,'static/register.html'));
});

router.post('/register', 
    body('email').isEmail(),
    body('password').isLength({min:5}),
    async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        const errors = validationResult(req.body);

        if(!errors.isEmpty()) {
            endCon();
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data on register!'
            });
        }

        const user = { 
            email: req.body.email, 
            password: req.body.password 
        };

        user.password = await bcrypt.hash(user.password, 12);

        const resFind = await con.awaitQuery('SELECT * FROM users WHERE email = ?', user.email, 
            (err) => { if(err) throw(err); }
        );

        if(resFind.length !== 0) {
            endCon();
            return res.status(400).json({message: 'This email already exists!'});
        }
        
        await con.awaitQuery('INSERT INTO users SET ?', user, 
            (err) => { if(err) throw(err); } 
        );

        endCon();
        return res.status(201).json({message: 'User registered successfully!'});

    } catch (e) {
        endCon();
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'static/login.html'));
});

router.post('/login', 
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({min:6}),
    async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            endCon();
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data on register!'
            });
        }

        const user = { 
            email: req.body.email, 
            password: req.body.password 
        };

        const resFind = await con.awaitQuery('SELECT * FROM users WHERE email = ?', user.email, 
            (err) => { if(err) throw(err); }
        );

        if(resFind.length === 0) {
            endCon();
            return res.status(400).json({message: "This email doesn't exists!"});
        }

        const resSelect = await con.awaitQuery('SELECT password FROM users WHERE email = ?', user.email, 
            (err) => { if(err) throw(err); }
        );

        endCon();

        const password_hash = resSelect[0]['password'];
        const verified = await bcrypt.compareSync(user.password, password_hash);

        if(!verified) {
            return res.status(400).json({message: 'Wrong password!'});
        } 

        const token = jwt.sign(
            { userId: resSelect[0]['id'] },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'User logged in successfully!',
            email: user.email,
            token: token
        });

    } catch (e) {
        endCon();
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.delete('/delete/:email',
    async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        const email = req.params.email;

        if(email === undefined) {
            endCon();
            return res.status(400).json({message: 'User not logged!'});
        }

        const resId = await con.awaitQuery('SELECT id FROM users WHERE email = ?', email, 
            (err) => { if(err) throw(err); }
        );

        await con.awaitQuery('DELETE FROM posts WHERE id = ?', resId[0].id, 
            (err) => { if(err) throw(err); }
        );

        await con.awaitQuery('DELETE FROM users WHERE email = ?', email, 
            (err) => { if(err) throw(err); }
        );

        endCon();

        const dir = path.join(__dirname, 'images', email);
        fs.rmdirSync(dir, { recursive: true }, (err) => {
            if(err) throw(err);
        });

        return res.status(201).json({message: 'User and his data deleted successfully!'});

    } catch (e) {
        endCon();
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

export { router };