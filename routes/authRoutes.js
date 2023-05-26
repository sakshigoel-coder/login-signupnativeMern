const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const User= mongoose.model('User');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

require('dotenv').config();

async function mailer(recievermail,code) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS:true, // true for 465, false for other ports
    auth: {
      user: 'goyalsakshi907@gmail.com', // generated ethereal user
      pass: 'fetamcywzlbjxuwr', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'goyalsakshi907@gmail.com', // sender address
    to: `${recievermail}`, // list of receivers
    subject: "Signup Verification", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Your Verification Code:${code}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

router.post('/signup', async (req, res) => {
  const { name, email, password, dob,address} = req.body;
        const user = new User({
          name,
          email,
          password,
          dob, 
          address                 // new user signup
        });
        try {
          await user.save();
          const token=jwt.sign({_id: user._id}, process.env.jwt_Secret);
          return res.send({message:"User Registered Successfully",token });
          // Return the response

        } catch (err) {
          console.log("DB error", err);
          return res.status(422).send({ error: err.message });
        }
      })
    


  router.post('/verify', (req, res) => {

    console.log("sent by client- ", req.body);
    const { name, email, password, dob,address} = req.body;
    if (!email || !password || !name || !dob || !address) {
      return res.status(422).send({ error: "Please fill all the fields" });
    }
  
    User.findOne({ email: email })
      .then(async (existingUser) => {
        if (existingUser) {                        // existing user
          return res.status(422).send({ error: "Invalid Credentials" });
        }
        try{
          let Verificationcode=Math.floor(100000 + Math.random()*900000);
          let user=[
            {
              name,
              password,
              email,
              dob,
              address,
              Verificationcode
            }
          ]
          mailer(email,Verificationcode);
          res.send({message:"Your Verification Mail will sent to your Email",udata:user});
        }
        catch(err){
          console.log(err);
          return res.status(500).json({ error: "Server Error" });
        }
  
  })
});
  
  
  router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "Please add email and password" });
    }
  
    const savedUser = await User.findOne({ email: email });
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
  
    try {
      const isPasswordMatch = await bcrypt.compare(password, savedUser.password);
      if (isPasswordMatch) {
        console.log('Password matched');
        const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_Secret);
        return res.status(200).json({ token });
      } else {
        console.log("Password does not match");
        return res.status(422).json({ error: "Invalid Credentials" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server Error" });
    }

  })

module.exports= router;
    