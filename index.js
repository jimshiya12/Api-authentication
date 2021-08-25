const  express =require("express");
const app = express();
const mongoose= require('mongoose');
const dotenv=require('dotenv');
const postRoute= require('./Router/posts');

//import routes
const authRoute=require('./Router/auth');

dotenv.config();


// connect to DB
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true},
    () => console.log('connected to db!')
);

//middileware
app.use(express.json());
//route Middileware
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);


app.listen(3000,()=> console.log("server up and running"));
