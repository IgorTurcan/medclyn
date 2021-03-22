import express from 'express';
import https from 'https';
import { router as userRouter } from './routes/user.routes.js';
import { router as postRouter } from './routes/post.routes.js';
import { router as serviceRouter } from './routes/service.routes.js';
import { connectDB, initDB } from './db.js'
import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';

const __dirname = path.resolve();
const options = {
    key: fs.readFileSync('security/key.pem'),
    cert: fs.readFileSync('security/cert.pem')
};

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
initDB();

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cors());
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/service', serviceRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'static/home.html'));
});

https.createServer(options, app)
.listen(PORT, () => {
    console.log(`Server listening on the port::${PORT}`);
});