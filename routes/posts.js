const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")

//Create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(403).json(error)
    }
})

//Update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId) {
            await post.updateOne({$set: req.body})
            res.status(200).json("Th post has been updated")
        } else {
            res.status(403).json("You can update only your posts")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//Delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("Th post has been deleted")
        } else {
            res.status(403).json("You can delete only your posts")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//Like a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        console.log(post)
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}})
            res.json("Post liked")
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}})
            res.json("Post disliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(403).json(error)
    }
})

//Get all posts/timeline
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({userId: currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.followings.map(frienId => {
                Post.find({userId: frienId})
            })
        )
        res.json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
