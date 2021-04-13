import pkg from 'mongoose';
const {Schema, model, Types} = pkg;

const schema = new Schema({
	name: {type: String, required: true},
	img: {data: Buffer, contentType: String},
});

const Img = model('Img', schema);

export { Img };