const mongoose = require('mongoose');
const express = require('express');

const {PostMessage} = require('../models/posts');

 const getPost = async (req, res) => { 
    try {
        const postMessages = await PostMessage.find();
                
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
 const createPost = async (req, res) => {
    const { message, creator, selectedFile } = req.body;
    

    const newPostMessage = new PostMessage({  message,  creator, selectedFile })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const updatePost = async(req, res) =>{

    const { message, creator, selectedFile } = req.body;
    // console.log(`${message} ${creator}`);


    try {

        const {id:_id} = req.params;
        const post = req.body;
   
        if(!mongoose.isValidObjectId(_id)){
            return res.status(404).send("Post not Found");
        }
   
        const updatedPost =  await PostMessage.findByIdAndUpdate(_id, {message, creator, selectedFile}, {new : true});
   
        res.status(202).json(updatedPost);
        
    } catch (error) {

        console.log(error);
        res.status(409).json({message : error.message});
        
    }

    

}

const deletePost = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
        await PostMessage.findByIdAndRemove(id);
    
        res.json({ message: "Post deleted successfully." });
        
    } catch (error) {

        console.log(error);
        res.status(409).json({message : error.message})
        
    }
   
}

const likePost = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        
        const post = await PostMessage.findById(id);
    
        const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
        
        res.json(updatedPost);
        
    } catch (error) {

        console.log(error);
        res.status(409).json({message : error.message})
        
    }
   
}





module.exports = {getPost, createPost, updatePost, deletePost, likePost};

