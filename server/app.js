import express from 'express';
import http from 'http';
import mongoose from 'mongoose'; 
import { router as userRouter } from './routes/user.routes.js';
import { router as postRouter } from './routes/post.routes.js';
import { router as serviceRouter } from './routes/service.routes.js';
import path from 'path';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cors());
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/service', serviceRouter);

async function start() {
    try {
        await mongoose.connect(
            'url',{
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        );
        http.createServer(app)
            .listen(port, () => {
                console.log(`Server listening on the port::${port}`);
            });
    } catch (e) {
       console.log('Server error: ', e.message);
       process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'static/home.html'));
});

start();