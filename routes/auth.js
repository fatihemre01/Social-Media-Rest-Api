const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).send("User not found!")
        const validatePasssword = await bcrypt.compare(req.body.password, user.password)
        !validatePasssword && res.status(400).send("Wrong password!")

        res.status(200).send("Logged in!!")
    } catch (error) {
        res.json(error)
        console.log(error)
    }
})

module.exports = router