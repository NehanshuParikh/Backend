import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { generateTokensAndSendAsCookie } from "../utils/tokens.js";

export async function signup(req, res) {
    try {
        const { username, email, password } = req.body

        // input validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email || !password || !username)
            return res.status(400).json({ success: false, message: "All fields are required" });

        if (!emailRegex.test(email))
            return res.status(400).json({ success: false, message: "Invalid email" });

        if (password.length < 8)
            return res.status(400).json({ success: false, message: "Password must be at least of 8 characters" });

        // checking if user already exists
        const existingUserByEmail = await User.findOne({ email: email })
        if (existingUserByEmail)
            return res.status(400).json({ success: false, message: "Email already exists" });

        const existingUserByUsername = await User.findOne({ username: username })
        if (existingUserByUsername)
            return res.status(400).json({ success: false, message: "Username already exists" });

        const existingUserByPassword = await User.findOne({ password: password })
        if (existingUserByPassword)
            return res.status(400).json({ success: false, message: "Password already exists" });

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png']
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            username,
            email,
            password: hashedPass,
            image
        })

        generateTokensAndSendAsCookie(newUser._id, res);
        await newUser.save()
        res.status(201).json({
            success: true, user: {
                ...newUser._doc,
                password: ''
            }
        })



    } catch (error) {
        console.log("Error in Signup Controller ", error.message)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ success: false, message: "Please provide email and password"})

        const user = await User.findOne({ email: email })
        if (!user)
            return res.status(400).json({ success: false, message: "Invalid Credentials"})
        
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch)
            return res.status(400).json({ success: false, message: "Invalid Credentials"})

        generateTokensAndSendAsCookie(user._id, res)
        res.status(200).json({ success: true, user: {
            ...user._doc,
            password: ''
        }})

    } catch (error) {
        console.log("Error in Login Controller ", error.message)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export async function logout(req,res) {
    try {
        res.clearCookie('token')
        res.status(200).json({ success:true, message: "Loged Out Successfully" });
    } catch (error) {
        console.log("Error in Logout Controller ", error.message)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
