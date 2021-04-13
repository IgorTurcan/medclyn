import pkg from 'mongoose';
const {Schema, model, Types } = pkg;

const schema = new Schema({
	title: {type: String, required: true, unique: true},
	subtitle: {type: String, required: true},
	imagesIds: [{type: Types.ObjectId, ref: 'Img'}],
});

const Post = model('Post', schema);

export { Post };