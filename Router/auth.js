
const user = require("../model/user");
const jwt =require('jsonwebtoken');
const {registerValidation, loginValidation}=require('../alidation')
const bcrypt= require('bcryptjs');
//validation






router.post('/register', (req,res)=>{


    //lets validate the data before we user
    const{error}= registerValidation(req.body);
    if (error) return res.status(400).send(erro.details[0].message);

//checking if the user is already in the database
const emailExist=await user.findOne({email:req.body.eamil});
if (emailExist) return res.status(400).send('Email already exist');


// hash the passwords

const salt= await bcrypt.genSalt(10);
const hashedPassword= await bcrypt.hash(req.body.password, salt);

//Create a new user
   const user = new user({
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword
  });

   try{
       const savedUser = await user.save();
       res.send({user:user._id});

   }catch(err){
       res.status(400).send(err);
   }
});

//login

router.post('/login', async(req,res) => {
    //lets validate the data before we user
    const{error}= loginValidation(req.body);
    if (error) return res.status(400).send(erro.details[0].message);
    //checking if the email exist
const user=await user.findOne({email:req.body.eamil});
if (!user) return res.status(400).send('Email is not found');

//password is correct
const validPass= await bcrypt.compare(req.body.password, user.password);
if(!validPass)return res.status(400).send('invalid password');

//create and asiign a token

const token=jwt.sign({id:user._id}, process.env.TOKEN_SECRET)
res.header('auth.token', token).send(token);


res.send('logged in');





});




