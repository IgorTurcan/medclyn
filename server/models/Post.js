import pkg from 'mongoose';
const {Schema, model } = pkg;

const schema = new Schema({
	title: {type: String, required: true, unique: true},
	subtitle: {type: String, required: true}
});

//	posts: [{type: Types.ObjectId, ref: 'Img'}],

const Post = model('Post', schema);

export { Post };