import { User } from '../models/User.js'
import { Post } from '../models/Post.js'
import { Img } from '../models/Img.js'
import bcrypt from 'bcryptjs';

const auth = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        if(!user) {
            req.user = null;
            return res.status(400).json({message: "This user doesn't exists!", auth: 'false'});
        }

        const verified = await bcrypt.compareSync(password, user.password);

        if(!verified) {
            req.user = null;
            return res.status(400).json({message: 'Wrong password!', auth: 'false'});
        }

        req.user = user;

        // const users = await User.find();
        // for(const user of users) {
        //     console.log('\n'+user.email);
        //     for(const postId of user.postsIds) {
        //         const post = await Post.findOne({_id: postId});
        //         console.log('  '+post.title);
        //         for(const imageId of post.imagesIds) {
        //             const image = await Img.findOne({_id: imageId});
        //             console.log('    '+image.name);
        //         }
        //     }
        // }

        next();
    } catch (e) {
        return res.status(400).json({message: "Something went wrong!", auth: 'false', error: `${e}`});
    }
    
}

export { auth };

/*



60757ee3991f94097804f877
6076e4e56acc840ce484c442
*/