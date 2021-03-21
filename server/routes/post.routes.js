import express from 'express';
import fs from 'fs';
import { connectDB, getCon, endCon } from '../db.js'
import path from 'path';
import multer from 'multer';

const router = express.Router();
const __dirname = path.resolve();
const upload = multer({ dest: `./images/` });

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

        const photosPath = path.join(__dirname, 'images', email, title);

        const resFind = await con.awaitQuery('SELECT * FROM posts WHERE title = ?', title, 
            (err) => { if(err) throw(err); }
        );

        if(resFind.length !== 0) {
            const dir = path.join(__dirname, 'images');
            deleteUnusedImages(dir);
            endCon();
            return res.status(400).json({message: 'A post with such title exist already!'});
        }

        await con.awaitQuery(`INSERT INTO posts SET ?`, 
        { id: resId[0].id, title, subtitle, photosPath },
            (err) => { if(err) throw(err); }
        );

        endCon();

        if(!fs.existsSync(path.join(__dirname, 'images', email))){
            fs.mkdirSync(path.join(__dirname, 'images', email));
        }

        if(!fs.existsSync(photosPath)){
            fs.mkdirSync(photosPath);
        }

        for(const file of req.files) {
            const fileName = file.originalname.slice(0,file.originalname.indexOf('.'))
            const currentPath = file.path;
            const destinationPath = path.join(__dirname, 'images', email, title, fileName);

            fs.rename(currentPath, destinationPath, (err) => {
                if(err) throw(err);
            });
        }
        
        return res.status(201).json({message: 'Post added successfully!'});

    } catch (e) {
        const dir = path.join(__dirname, 'images');
        deleteUnusedImages(dir);
        endCon();
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
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
            const dir = path.join(__dirname, 'images');
            deleteUnusedImages(dir);
            endCon();
            return res.status(400).json({message: "That post doesn't exist!"});
        }

        const findNew = await con.awaitQuery('SELECT * FROM posts WHERE title = ?', newTitle, 
            (err) => { if(err) throw(err); }
        );

        if((findNew.length !== 0) && (previousTitle !== newTitle)) {
            const dir = path.join(__dirname, 'images');
            deleteUnusedImages(dir);
            endCon();
            return res.status(400).json({message: `Post with name ${newTitle} aready exist!`});
        }

        const photosPath = path.join(__dirname, 'images', email, newTitle);

        await con.awaitQuery(`UPDATE posts 
        SET title = ?, subtitle = ?, photosPath = ? WHERE postId = ?`, 
        [ newTitle, subtitle, photosPath, findPrevious[0].postId ], 
            (err) => { if(err) throw(err); }
        );

        endCon();

        if(!fs.existsSync(photosPath)) {
            fs.mkdirSync(photosPath);
        }

        if(previousTitle !== newTitle) {
            const dir = path.join(__dirname, 'images', email, previousTitle);
            fs.rmdir(dir, { recursive: true }, (err) => {
                if(err) throw(err);
            });
        } else {
            const dir = photosPath;
            deleteUnusedImages(dir);
        }

        for(const file of req.files) {
            const fileName = file.originalname.slice(0,file.originalname.indexOf('.'))
            const currentPath = file.path;
            const destinationPath = path.join(__dirname, 'images', email, newTitle, fileName);

            fs.rename(currentPath, destinationPath, (err) => {
                if(err) throw(err);
            });
        }

        return res.status(202).json({message: 'Post edited successfully!'});

    } catch (e) {
        const dir = path.join(__dirname, 'images');
        deleteUnusedImages(dir);
        endCon();
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.delete('/delete/:email/:title',
    async (req, res) => {
    try {
        connectDB();
        const con = getCon();

        const email = req.params.email;
        const title = req.params.title;

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
            const dir = path.join(__dirname, 'images');
            deleteUnusedImages(dir);
            endCon();
            return res.status(400).json({message: "That post doesn't exist!"});
        }

        await con.awaitQuery('DELETE FROM posts WHERE postId = ?', findPost[0].postId, 
            (err) => { if(err) throw(err); }
        );

        endCon();

        const dir = path.join(__dirname, 'images', email, title);
        fs.rmdir(dir, { recursive: true }, (err) => {
            if(err) throw(err);
        });

        return res.status(201).json({message: 'Post deleted successfully!'});

    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: e});
    }
});

router.get('/get/:email', async (req, res) => {
    connectDB();
    const con = getCon();
    
    const email = req.params.email;
    let resPosts = [];

    if(email === undefined) {
        endCon();
        return res.status(400).json({message: 'User not logged!'});
    }

	const user = await con.awaitQuery('SELECT * FROM users WHERE email = ?', email, 
		(err) => { if(err) throw(err); }
    );
    
    const posts = await con.awaitQuery('SELECT * FROM posts WHERE id = ?', user[0].id, 
        (err) => { if(err) throw(err); }
    );

    endCon();

    if(posts.length !== 0) {
        for(const post of posts) {
            let fileData = [];
            const dir = path.join(__dirname,'images', user[0].email, post.title);
    
            fs.readdirSync(dir).forEach(file => {
                const filePath = path.join(dir,file);
                const data = fs.readFileSync(filePath, {encoding: 'base64'});
                fileData.push(data);
            });
    
            resPosts.push({
                userEmail: user.email,
                title: post.title,
                subtitle: post.subtitle,
                paths: fileData
            });
        } 
        return res.json({resPosts});
    } else {
        return res.status(204).json({});
    }
});

router.get('/getAll', async (req, res) => {
    connectDB();
    const con = getCon();

	let resPosts = [];

	const users = await con.awaitQuery('SELECT * FROM users', [], 
		(err) => { if(err) throw(err); }
    );
    
    if(users.length !== 0) {
        for(const user of users) {
            const posts = await con.awaitQuery('SELECT * FROM posts WHERE id = ?', user.id, 
                (err) => { if(err) throw(err); }
            );
            
            for(const post of posts) {
                let fileData = [];
                const dir = path.join(__dirname,'images', user.email, post.title);
    
                fs.readdirSync(dir).forEach(file => {
                    const filePath = path.join(dir,file);
                    const data = fs.readFileSync(filePath, {encoding: 'base64'});
                    fileData.push(data);
                });
    
                resPosts.push({
                    userEmail: user.email,
                    title: post.title,
                    subtitle: post.subtitle,
                    paths: fileData
                });
            }
        }
        endCon();
        return res.json({resPosts});
    } else {
        endCon();
        return res.status(204).json({});
    }
});

export { router };

function deleteUnusedImages(dir) {
    fs.readdir(dir, (err, files) => {
        if(err) throw(err);

        for (const file of files) {
            const filePath = path.join(dir, file);
            if(!fs.lstatSync(filePath).isDirectory()) {
                fs.unlink(filePath, err => {
                    if(err) throw(err);
                });
            } 
        }
    });
}