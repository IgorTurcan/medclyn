import express from 'express';
import fs from 'fs';
import { connectDB, getCon, endCon } from '../db.js'
import path from 'path';
import multer from 'multer';

const router = express.Router();
const __dirname = path.resolve();
const uploadDirname = path.join(__dirname,'uploads');
const upload = multer({ dest: `./uploads/` });

router.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname,'static/addPost.html'));
});

router.post('/add',
    upload.array('photos',6),
    async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        const email = req.body.email;
        const title = req.body.title;
        const subtitle = req.body.subtitle;

        if(email === undefined) {
            endCon();
            return res.status(400).json({message: 'User not logged!'});
        }

        const resId = await con.awaitQuery('SELECT id FROM users WHERE email = ?', email, 
            (err) => { if(err) throw(err); }
        );

        const resFind = await con.awaitQuery('SELECT * FROM posts WHERE title = ?', title, 
            (err) => { if(err) throw(err); }
        );

        if(resFind.length !== 0) {
            endCon();
            for(let i = 0; i < req.files.length; i++) {
                if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
                    fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
                }
            }
            return res.status(400).json({message: 'A post with such title exist already!'});
        }

        let post = {
            id: resId[0].id, 
            title: title, 
            subtitle: subtitle
        }

        for(let i = 0; i < req.files.length; i++) {
            const aux = fs.readFileSync(path.join(uploadDirname,req.files[i].filename));
            post['photo'+i] = aux;
        }        
    
        await con.awaitQuery(`INSERT INTO posts SET ?`, post,
            (err) => { if(err) throw(err); }
        );

        endCon();

        for(let i = 0; i < req.files.length; i++) {
            fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
        }
        
        return res.status(201).json({message: 'Post added successfully!'});

    } catch (e) {
        endCon();
        for(let i = 0; i < req.files.length; i++) {
            if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
                fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
            }
        }
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname,'static/editPost.html'));
});

router.put('/edit',
    upload.array('photos',6),
    async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        const email = req.body.email;
        const previousTitle = req.body.previousTitle;
        const newTitle = req.body.newTitle;
        const subtitle = req.body.subtitle;

        if(email === undefined) {
            endCon();
            return res.status(400).json({message: 'User not logged!'});
        }

        const resId = await con.awaitQuery('SELECT id FROM users WHERE email = ?', email, 
            (err) => { if(err) throw(err); }
        );
        
        const findPrevious = await con.awaitQuery('SELECT * FROM posts WHERE id = ? AND title = ?', 
        [ resId[0].id, previousTitle ], 
            (err) => { if(err) throw(err); }
        );

        if(findPrevious.length === 0) {
            endCon();
            for(let i = 0; i < req.files.length; i++) {
                if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
                    fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
                }
            }
            return res.status(400).json({message: "That post doesn't exist!"});
        }

        const findNew = await con.awaitQuery('SELECT * FROM posts WHERE title = ?', newTitle, 
            (err) => { if(err) throw(err); }
        );

        if((findNew.length !== 0) && (previousTitle !== newTitle)) {
            endCon();
            for(let i = 0; i < req.files.length; i++) {
                if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
                    fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
                }
            }
            return res.status(400).json({message: `Post with name ${newTitle} aready exist!`});
        }

        let post = {
            id: resId[0].id, 
            title: newTitle, 
            subtitle: subtitle
        }

        for(let i = 0; i < req.files.length; i++) {
            const aux = fs.readFileSync(path.join(uploadDirname,req.files[i].filename));
            post['photo'+i] = aux;
        }

        for(let i = req.files.length; i < 5; i++) {
            console.log(i+'<'+5);
            post['photo'+i] = null;
        }

        await con.awaitQuery(`UPDATE posts 
            SET ? WHERE postId = ?`, [post, findPrevious[0].postId], 
            (err) => { if(err) throw(err); }
        );

        endCon();

        for(let i = 0; i < req.files.length; i++) {
            fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
        }

        return res.status(202).json({message: 'Post edited successfully!'});

    } catch (e) {
        endCon();
        for(let i = 0; i < req.files.length; i++) {
            if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
                fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
            }
        }
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname,'static/deletePost.html'));
});

router.delete('/delete',
    async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        const email = req.body.email;
        const title = req.body.title;

        if(email === undefined) {
            endCon();
            return res.status(400).json({message: 'User not logged!'});
        }
        
        const resId = await con.awaitQuery('SELECT id FROM users WHERE email = ?', email, 
            (err) => { if(err) throw(err); }
        );

        const findPost = await con.awaitQuery('SELECT * FROM posts WHERE id = ? AND title = ?', 
        [ resId[0].id, title ], 
            (err) => { if(err) throw(err); }
        );

        if(findPost.length === 0) {
            endCon();
            return res.status(400).json({message: "That post doesn't exist!"});
        }

        await con.awaitQuery('DELETE FROM posts WHERE postId = ?', findPost[0].postId, 
            (err) => { if(err) throw(err); }
        );

        endCon();

        return res.status(201).json({message: 'Post deleted successfully!'});

    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.get('/get/:email', async (req, res) => {
    try {
        connectDB();
        const con = getCon();
        
        const email = req.params.email;
        let posts = [];

        if(email === undefined) {
            endCon();
            return res.status(400).json({message: 'User not logged!'});
        }

        const user = await con.awaitQuery('SELECT * FROM users WHERE email = ?', email, 
            (err) => { if(err) throw(err); }
        );
        
        posts = await con.awaitQuery('SELECT * FROM posts WHERE id = ?', user[0].id, 
            (err) => { if(err) throw(err); }
        );

        endCon();

        if(posts.length !== 0) {
            return res.json({posts});
        } else {
            return res.status(204).json({});
        }
    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.get('/getAll', async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        let posts = [];

        const users = await con.awaitQuery('SELECT * FROM users', [], 
            (err) => { if(err) throw(err); }
        );
        
        if(users.length !== 0) {
            for(const user of users) {
                posts = await con.awaitQuery('SELECT * FROM posts WHERE id = ?', user.id, 
                    (err) => { if(err) throw(err); }
                );
            }
            endCon();
            return res.json({posts});
        } else {
            endCon();
            return res.status(204).json({});
        }
    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

export { router };
