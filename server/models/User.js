import pkg from 'mongoose';
const {Schema, model, Types} = pkg;

const schema = new Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	posts: [{type: Types.ObjectId, ref: 'Post'}]
});

const User = model('User', schema);

export { User };