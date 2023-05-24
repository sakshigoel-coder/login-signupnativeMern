const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const User= mongoose.model('User');
const jwt= require('jsonwebtoken');

require('dotenv').config();

router.post('/signup', (req, res) => {
    console.log("sent by client- ", req.body);
    const { name, email, password, dob } = req.body;
    if (!email || !password || !name || !dob) {
      return res.status(422).send({ error: "Please fill all the fields" });
    }
  
    User.findOne({ email: email })
      .then(async (existingUser) => {
        if (existingUser) {
          return res.status(422).send({ error: "Invalid Credentials" });
        }
        const user = new User({
          name,
          email,
          password,
          dob,
        });
        try {
          await user.save();
          const token=jwt.sign({_id: user._id}, process.env.jwt_Secret);
          return res.send({token });
          // Return the response

        } catch (err) {
          console.log("DB error", err);
          return res.status(422).send({ error: err.message });
        }
      })
      .catch((err) => {
        console.log("DB error", err);
        return res.status(500).send({ error: "Internal Server Error" });
      });
  });
  
module.exports= router;
    