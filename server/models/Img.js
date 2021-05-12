import pkg from 'mongoose';
const {Schema, model} = pkg;

const schema = new Schema({
	name: {type: String, required: true},
	path: {type: String, required: true},
});

const Img = model('Img', schema);

export { Img };