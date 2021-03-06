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
        

        next();
    } catch (e) {
        return res.status(400).json({message: "Something went wrong!", auth: 'false', error: `${e}`});
    }
}

export { auth };
