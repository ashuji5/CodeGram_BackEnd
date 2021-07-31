const mongoose = require('mongoose');
const express = require('express');

const {PostMessage} = require('../models/posts');
const {comment} = require('../models/Comment');
const {user} = require('../models/users');
const {answers} = require('../models/answer');
const {doubt} = require('../models/doubt');
const { post } = require('../routes/users');

//  const getPost = async (req, res) => { 
//     try {
//         const postMessages = await PostMessage.find().populate('comment');
                
//         res.status(200).json(postMessages);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// }


const getPost = async (req, res) => {
    try {
      const currentUser = await user.findById(req.userID);
      const userPosts = await PostMessage.find({ "creator": currentUser._id }).populate('comment');
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return PostMessage.find({ userId: friendId }).populate('comment');
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
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
        
        const posts = await PostMessage.find({"creator" : id}).populate('comment');

        
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


const followUser = async (req, res) => {
  console.log("follow");
    if (req.userID !== req.params.id) {
      try {
        
        console.log(req.userID);
        console.log("other"+req.params.id);

        const guest = await user.findById(req.params.id);
        const currentUser = await user.findById(req.userID);
        if (!guest.followers.includes(req.userID)) {
          await guest.updateOne({ $push: { followers: req.userID } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
        console.log(err)
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  };



  const unFollowUser = async (req, res) => {
    console.log("unfollow");
    if (req.userID !== req.params.id) {
      try {
        const guest = await user.findById(req.params.id);
        const currentUser = await user.findById(req.userID);
        if (guest.followers.includes(req.userID)) {
          await guest.updateOne({ $pull: { followers: req.userID } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  };

const getUser = async(req, res) => {
    try {
        console.log("it hit")
        const {username} = req.params;

        console.log(username);

        const foundUser = await user.find({name : username});
        
         const posts = await PostMessage.find({"creator" : foundUser[0]._id})

         const friend = {
           user : foundUser,
           post : posts
         }

        res.status(200).json(friend);

    } catch (error) {

        res.status(404).json({message : error.message});
        
    }
}

const getFriend =  async (req, res) => {
  try {
    const currUser = await user.findById(req.params.userId);
    const friends = await Promise.all(
      currUser.followings.map((friendId) => {
        return user.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, name, profileImg } = friend;
      friendList.push({ _id, name, profileImg });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
}

const postDoubt = async(req, res) => {

  const {Question} = req.body;

  console.log("its clicked");
  console.log(Question)
    

    const newDoubt = new doubt({ Qestion :Question,user : req.userID, createdAt: new Date().toISOString() });

  try {

    await newDoubt.save();

    res.status(201).json(newDoubt)
    
  } catch (error) {

    res.status(409).json({message : error.message});
    
  }
}

const postAnswer = async(req, res) =>{

  

  try {

    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const {answer} = req.body;
    
    // console.log(req.user.name);

    const doubtData = await doubt.findById(id);

    const newAnswer = new answers({ answer , user : req.userID, createdAt: new Date().toISOString() });

    await newAnswer.save();

    doubtData.Answer.push(newAnswer._id);
    // const posty = await PostMessage.findById(id).populate('comment');
    //  await posty.save();
    await doubtData.save();

    res.status(201).json(doubtData);

    
  } catch (error) {

    res.status(409).json(error);
    
  }

}

const getDoubt = async(req, res) =>{
  try {
    
    const doubts = await doubt.find();

    res.status(200).json(doubts);


  } catch (error) {
    res.status(400).json(error)
  }
}

const getDoubtById = async(req, res) => {
  try {

    const {id} = re.params;

    const doubtById = await doubt.findById(id).populate('Answer');

    res.status(200).json(doubtById)
    
  } catch (error) {

    res.status(400).json(error);
    
  }
}



module.exports = {getPost, createPost, updatePost, deletePost, likePost, getUserPost, commentPost, followUser, unFollowUser, getUser, getFriend, postDoubt,postAnswer, getDoubt, getDoubtById};

