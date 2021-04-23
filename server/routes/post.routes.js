import express from 'express';
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

router.post('/add', uploadFiles,
    body('email').normalizeEmail().isEmail(),
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

        const email = req.body.email;
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
            { email },
            { $push : { postsIds: post } }
        );

        await cleanUploads();
        return res.status(201).json({message: 'Post added successfully!'});
    } catch (e) {
        await cleanUploads();
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

router.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname,'static/editPost.html'));
});

router.put('/edit', uploadFiles,
    body('previousTitle').isLength({min:3, max:35}),
    body('newTitle').isLength({min:3, max:35}),
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

        const previousTitle = req.body.previousTitle;
        const newTitle = req.body.newTitle;
        const subtitle = req.body.subtitle;

        const post = await Post.findOne({ title: previousTitle });
        if(post){
            //Delte post's images
            for(const imageId of post.imagesIds) {
                await Img.findOneAndDelete({_id: imageId});
            }

            //Add new images
            let imagesIds = [];
            for(let i=0; i<req.files.length; i++) {
                const image = new Img({
                    name: req.files[i].originalname,
                    img: {
                        data: fs.readFileSync(path.join(__dirname,'uploads',req.files[i].originalname)),
                        contentType: req.files[i].mimetype
                    }
                });
                await image.save();
                imagesIds.push(image['_id']);
            }

            //update post
            await Post.updateOne(
                { title: previousTitle }, 
                { $set : { title: newTitle, subtitle: subtitle, imagesIds: imagesIds } }
            );
        } else {
            return res.status(400).json({message: 'No such post!'});
        }

        await cleanUploads();
        return res.status(202).json({message: 'Post edited successfully!'});
    } catch (e) {
        await cleanUploads();
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

router.get('/delete', (req, res) => {
    res.sendFile(path.join(__dirname,'static/deletePost.html'));
});

router.delete('/delete/:email/:title',
    async (req, res) => {
    try {
        const email = req.params.email;
        const title = req.params.title;

        if(!email) {
            return res.status(400).json({message: 'No such user!'});
        } else if(!title) {
            return res.status(400).json({message: 'No such title!'});
        }

        const post = await Post.findOne({ title });

        if(post){
            //delete all images
            for(const imageId of post.imagesIds) {
                await Img.findOneAndDelete({_id: imageId});
            }
            //update user
            await User.updateOne(
                { email: email },
                { $pull : { postsIds: post._id } }
            );
            //delete post
            await Post.findOneAndDelete({ title });
            return res.status(201).json({message: 'Post deleted successfully!'});
        } else {
            return res.status(201).json({message: "No such user's post found!"});
        }
    } catch (e) {
        return res.status(500).json({message: 'Something went wrong!', error: `${e}`});
    }
});

router.get('/get/:email', 
    async (req, res) => {
    try {
        const email = req.params.email;
        if(!email) {
            return res.status(400).json({message: 'No such user!'});
        }

        let postObjs = [];

        let user = await User.findOne({ email });

        if(user) {
            for(const postId of user.postsIds) {
                const post = await Post.findOne({ _id: postId });
                let postObj = {
                    title: post.title,
                    subtitle: post.subtitle,
                    images: []
                };
                for(const imageId of post.imagesIds) {
                    const image = await Img.findOne({_id: imageId});
                    // if(!image) {
                    //     await post.updateOne({
                    //         $pull : { imagesIds: imageId }
                    //     });
                    // } else {
                        postObj.images.push({
                            data: image.img.data, 
                            type: image.img.contentType
                        });    
                    // }
                }
                postObjs.push(postObj);
            }    
        } else {
            return res.status(400).json({message: 'No such user!'});
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

router.get('/getAll', 
    async (req, res) => {
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
                    // if(!image) {
                    //     await post.updateOne({
                    //         $pull : { imagesIds: imageId }
                    //     });
                    // } else {
                        postObj.images.push({
                            data: image.img.data, 
                            type: image.img.contentType
                        });
                    // }
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