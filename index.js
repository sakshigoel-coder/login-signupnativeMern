const express=require('express');
const port = 3000;

const app=express();
const bodyparser= require('body-parser');
require('./db');
 require('./models/user');

const authRoutes= require('./routes/authRoutes');
const  requireToken=  require('./Middlewares/AuthTokenRequired');
app.use(bodyparser.json());
app.use(authRoutes);


app.get('/',requireToken,(req,res)=>{
    console.log(req.user);
    res.send(req.user);    // get request 
})

// app.post('/signup',(req,res)=>{
//     console.log(req.body);
//     res.send('This is signup page' );  // post request
// })

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})