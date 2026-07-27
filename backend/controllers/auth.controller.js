// imports
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { User } from '../models/user.model.js'

// login user controller
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, userName, password, isAdmin } = req.body

    if (!email || !userName || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format")
    }

    if (userName.trim().length <= 2) {
        throw new ApiError(400, "Username must be greater than 2 characters")
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new ApiError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { userName: userName.toLowerCase() }]
    })

    if (existedUser) {
        if (existedUser.email === email) {
            throw new ApiError(409, "User with email already exists")
        } else {
            throw new ApiError(409, "Username is already taken")
        }
    }

    const user = await User.create({
        email,
        userName: userName.toLowerCase(),
        password,
        isAdmin: isAdmin || false
    })

    const createdUser = await User.findById(user._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "User not found/Incorrect Email")
    }
    
    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(400, "Password is Incorrect")
    }

    const { accessToken } = await generateToken(user._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                accessToken
            }, "User logged in successfully")
        );
})

const loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, "User not found/Incorrect Email")
    }
    
    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(400, "Password is Incorrect")
    }

    const { accessToken } = await generateToken(user._id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                accessToken
            }, "Admin logged in successfully")
        );
})

export { registerUser, loginUser, loginAdmin }
