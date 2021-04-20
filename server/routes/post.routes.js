import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { uploadFiles } from '../middleware/uploadFiles.middleware.js';
import { User } from '../models/User.js'
import { Post } from '../models/Post.js'
import { Img } from '../models/Img.js'
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const __dirname = path.resolve();

router.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname,'static/addPost.html'));
});

router.post('/add', uploadFiles, auth, 
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({min:5, max:30}),
    body('title').isLength({min:3, max:35}),
    body('subtitle').isLength({min:3, max:45}),
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Wrong data on register!'
            });
        }

        const title = req.body.title;
        const subtitle = req.body.subtitle;        

        //create images
        let images = [];
        for(let i=0; i<req.files.length; i++) {
            const image = new Img({
                name: req.files[i].originalname,
                img: {
                    data: fs.readFileSync(path.join(__dirname,'uploads',req.files[i].originalname)),
                    contentType: req.files[i].mimetype
                }
            });
            await image.save();
            images.push(image);
        }

        //create post
        const post = new Post({ title, subtitle, imagesIds: images });
        await post.save();

        //update user
        await User.updateOne(
            { email: req.user.email },
            { $push : { postsIds: post } }
        );

        await cleanUploads();

        return res.status(201).json({message: 'Post added successfully!'});

    } catch (e) {
        await cleanUploads();
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

// router.get('/edit', (req, res) => {
//     res.sendFile(path.join(__dirname,'static/editPost.html'));
// });

// router.put('/edit',
//     upload.array('photos',6),
//     async (req, res) => {
//     try {
//         connectDB();
//         const con = getCon();

//         const email = req.body.email;
//         const previousTitle = req.body.previousTitle;
//         const newTitle = req.body.newTitle;
//         const subtitle = req.body.subtitle;

//         if(email === undefined) {
//             endCon();
//             return res.status(400).json({message: 'User not logged!'});
//         }

//         const resId = await con.awaitQuery('SELECT id FROM users WHERE email = ?', email, 
//             (err) => { if(err) throw(err); }
//         );
        
//         const findPrevious = await con.awaitQuery('SELECT * FROM posts WHERE id = ? AND title = ?', 
//         [ resId[0].id, previousTitle ], 
//             (err) => { if(err) throw(err); }
//         );

//         if(findPrevious.length === 0) {
//             endCon();
//             for(let i = 0; i < req.files.length; i++) {
//                 if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
//                     fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
//                 }
//             }
//             return res.status(400).json({message: "That post doesn't exist!"});
//         }

//         const findNew = await con.awaitQuery('SELECT * FROM posts WHERE title = ?', newTitle, 
//             (err) => { if(err) throw(err); }
//         );

//         if((findNew.length !== 0) && (previousTitle !== newTitle)) {
//             endCon();
//             for(let i = 0; i < req.files.length; i++) {
//                 if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
//                     fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
//                 }
//             }
//             return res.status(400).json({message: `Post with name ${newTitle} aready exist!`});
//         }

//         let post = {
//             id: resId[0].id, 
//             title: newTitle, 
//             subtitle: subtitle
//         }

//         for(let i = 0; i < req.files.length; i++) {
//             const aux = fs.readFileSync(path.join(uploadDirname,req.files[i].filename));
//             post['photo'+i] = aux;
//         }

//         for(let i = req.files.length; i < 5; i++) {
//             console.log(i+'<'+5);
//             post['photo'+i] = null;
//         }

//         await con.awaitQuery(`UPDATE posts 
//             SET ? WHERE postId = ?`, [post, findPrevious[0].postId], 
//             (err) => { if(err) throw(err); }
//         );

//         endCon();

//         for(let i = 0; i < req.files.length; i++) {
//             fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
//         }

//         return res.status(202).json({message: 'Post edited successfully!'});

//     } catch (e) {
//         endCon();
//         for(let i = 0; i < req.files.length; i++) {
//             if(fs.existsSync(path.join(uploadDirname,req.files[i].filename))){
//                 fs.unlinkSync(path.join(uploadDirname,req.files[i].filename));
//             }
//         }
//         return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
//     }
// });

// router.get('/delete', (req, res) => {
//     res.sendFile(path.join(__dirname,'static/deletePost.html'));
// });

// router.delete('/delete',
//     async (req, res) => {
//     try {
//         connectDB();
//         const con = getCon();

//         const email = req.body.email;
//         const title = req.body.title;

//         if(email === undefined) {
//             endCon();
//             return res.status(400).json({message: 'User not logged!'});
//         }
        
//         const resId = await con.awaitQuery('SELECT id FROM users WHERE email = ?', email, 
//             (err) => { if(err) throw(err); }
//         );

//         const findPost = await con.awaitQuery('SELECT * FROM posts WHERE id = ? AND title = ?', 
//         [ resId[0].id, title ], 
//             (err) => { if(err) throw(err); }
//         );

//         if(findPost.length === 0) {
//             endCon();
//             return res.status(400).json({message: "That post doesn't exist!"});
//         }

//         await con.awaitQuery('DELETE FROM posts WHERE postId = ?', findPost[0].postId, 
//             (err) => { if(err) throw(err); }
//         );

//         endCon();

//         return res.status(201).json({message: 'Post deleted successfully!'});

//     } catch (e) {
//         return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
//     }
// });

router.get('/get/:email', async (req, res) => {
    try {
        const email = req.params.email;

        if(email === undefined) {
            return res.status(400).json({message: 'User not logged!'});
        }

        let postObjs = [];

        let user = await User.findOne({ email });

        for(const postId of user.postsIds) {
            const post = await Post.findOne({ _id: postId });
            let postObj = {
                title: post.title,
                subtitle: post.subtitle,
                images: []
            };
            for(const imageId of post.imagesIds) {
                const image = await Img.findOne({_id: imageId});
                postObj.images.push({
                    data: image.img.data, 
                    type: image.img.contentType
                });
            }
            postObjs.push(postObj);
        }
        
        if(postObjs.length !== 0) {
            return res.json({postObjs});
        } else {
            return res.status(204).json({});
        }
    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

router.get('/getAll', async (req, res) => {
    try {
        let postObjs = [];
        let posts = await Post.find();

        if(posts.length!==0) {
            for(const post of posts) {
                let postObj = {
                    title: post.title,
                    subtitle: post.subtitle,
                    images: []
                };
                for(const imageId of post.imagesIds) {
                    const image = await Img.findOne({_id: imageId});
                    postObj.images.push({
                        data: image.img.data, 
                        type: image.img.contentType
                    });
                }
                postObjs.push(postObj);
            }

            return res.json({postObjs});
        } else {
            return res.status(204).json({message: 'No posts found!'});
        }
    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

export { router };

async function cleanUploads() {
    fs.readdir('./uploads', (err, files) => {
        if(err) throw err;
      
        for (const file of files) {
            fs.unlink(path.join('./uploads', file), err => {
                if (err) throw err;
            });
        }
    });
}