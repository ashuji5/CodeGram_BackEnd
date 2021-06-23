const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {user} = require('../models/users')


const signin= async(req, res) => {

    const {email, password} = req.body;

    try {

        const existingUser = await user.findOne({email});

        if(!existingUser) return res.status(404).json({message : "User doesn't exist"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(404).json({message : "Invalid Credentials"});

        const token = jwt.sign({email : existingUser.email, id : existingUser._id}, 'test', {expiresIn : "1h"});

        res.status(200).json({result : existingUser, token});
        
    } catch (error) {

        res.status(500).json({message : "Something went wrong."});
        
    }

}

 const signup = async(req, res) => {

    const {name, email, password, confirmpassword} =  req.body;

    try {

        if(!name || !email || !password || !confirmpassword) return res.status(400).json({message : "All fields are required"});

        const existingUser = await user.findOne({email});

        if(existingUser) return res.status(400).json({message : "User already exists"});

        if(password != confirmpassword) return res.status(400).json({message : "Passwords don't match"})

        const hashedPassword = await bcrypt.hash(password, 12)
        
        const result = await user.create({name, password: hashedPassword, email});

        const token = jwt.sign({email : result.email, id : result._id}, 'test', {expiresIn : "1h"});

        res.status(200).json({result, token});

        
    } catch (error) {

        res.status(500).json({message : "Something went wrong."});

        
    }

}

module.exports = {signin : signin,
    signup : signup
    };