const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { generateToken, jwtAuthMiddleware } = require('../jwt');

// POST-GET Method for person data
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log("Data saved");

        const payload = { id: response._id };  // Typically, you should use ID rather than name
        console.log(JSON.stringify(payload));

        const token = generateToken(payload);
        console.log("Token is:", token);

        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { adhaarCardNo, password } = req.body;
        const user = await User.findOne({ adhaarCardNo: adhaarCardNo });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Password' });
        }

        const payload = { id: user.id };
        const token = generateToken(payload);
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server error" });  // Changed to 500 for server error
    }
});

 router.get('/profile',  jwtAuthMiddleware ,async (req, res) => {
     try {
        const userData = res.user;
        const userId = userData.id;
        const user = await User.findById(userId);
     res.status(200).json({ user });
     } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server error" });
    }
});

// Corrected password change route
router.put('/profile/password', jwtAuthMiddleware , async (req, res) => {     try {
        const userId = req.user.id;  // Corrected to req.user.id, extracted from the jwtAuthMiddleware
         const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!await user.comparePassword(currentPassword)) {
            return res.status(401).json({ error: "Invalid current password" });
        }

       user.password = newPassword;
        await user.save();

        console.log("Password updated successfully");
        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {  // Add `err` to the catch block
        console.log(err);
        res.status(500).json({ error: "Internal Server error" });  // Changed to 500 for server error
    }
});



module.exports = router;
