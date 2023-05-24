const express=require('express');
const port = 3000;

const app=express();
const bodyparser= require('body-parser');

app.use(bodyparser.json());


app.get('/',(req,res)=>{
    res.send('This is home page');    // get request 
})

app.post('/signup',(req,res)=>{
    console.log(req.body);
    res.send('This is signup page' );  // post request
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})