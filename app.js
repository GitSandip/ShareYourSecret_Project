//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set({'strictQuery':false})
const encrypt= require("mongoose-encryption");
const md5=require("md5");
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const DBSchema=new mongoose.Schema({
  email:String,
  password:String
});

// const secret="sandipzalteatpost";

// DBSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User=mongoose.model("User",DBSchema);

// {
//   Above sequece is should be need to follow
// }

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  let email=req.body.username;
  let pass=req.body.password;

  User.findOne({email:email},function(err,foundItem){
    if(!err){
      if(foundItem){
        if(pass===foundItem.password){
          res.render("secrets");
        }else{
          console.log("wrong password");
        }
      }else{
        console.log("user not exist");
      }
    }
  })
})
app.get("/register",function(req,res){
  res.render("register");
})
app.get("/submit",function(req,res){
  res.render("submit");
})

app.post("/register",function(req,res){
  const newUser =new User({
    email:req.body.username,
    password:md5(req.body.password)
  })
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });

});









app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
