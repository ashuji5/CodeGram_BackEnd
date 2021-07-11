const mongoose = require('mongoose');
const express = require('express');

const {PostMessage} = require('../models/posts');
const {comment} = require('../models/Comment');
const { post } = require('../routes/users');

 const getPost = async (req, res) => { 
    try {
        const postMessages = await PostMessage.find().populate('comment');
                
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
 const createPost = async (req, res) => {
    const post = req.body;
    

    const newPostMessage = new PostMessage({ ...post,creator : req.userID, createdAt: new Date().toISOString() });

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const updatePost = async(req, res) =>{

    const { message, name, selectedFile } = req.body;
    // console.log(`${message} ${creator}`);


    try {

        const {id:_id} = req.params;
        const post = req.body;
   
        if(!mongoose.isValidObjectId(_id)){
            return res.status(404).send("Post not Found");
        }
   
        const updatedPost =  await PostMessage.findByIdAndUpdate(_id, {message, name, selectedFile}, {new : true});
   
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


const getUserPost = async(req, res) => {
    try {

        const { id } = req.params;
        
        const posts = await PostMessage.find({"creator" : id});

        
        res.status(200).json(posts);

        
    } catch (error) {

        console.log(error);
        res.status(404).json({message : error.message});
        
    }
}




const likePost = async (req, res) => {

    try {

        const { id } = req.params;

        if(!req.userID) return res.json({message : 'Unauthenticated'});

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        
        const post = await PostMessage.findById(id);

        const index = post.likes.findIndex((id) => id == String(req.userID));

        if(index == -1){
            post.likes.push(req.userID);
        }
        else{
           post.likes = post.likes.filter((id) => id != String(req.userID));
        }
    
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        
        
        res.json(updatedPost);
        
    } catch (error) {

        console.log(error);
        res.status(409).json({message : error.message})
        
    }
   
}

const commentPost = async(req, res) => {
    
    try {

        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const {content} = req.body;
        console.log(content);
        // console.log(req.user.name);

        const postData = await PostMessage.findById(id);

        const newComment = new comment({ content , post : postData._id });
   
        await newComment.save();

        postData.comment.push(newComment._id);
        // const posty = await PostMessage.findById(id).populate('comment');
        //  await posty.save();
        await postData.save();



        res.status(201).json(postData);

        
    } catch (error) {
        res.status(409).json({message : error.message});
    }
}





module.exports = {getPost, createPost, updatePost, deletePost, likePost, getUserPost, commentPost};

