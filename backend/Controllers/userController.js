const UserModel = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');

const loginController = expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, password } = req.body;

    const user = await UserModel.findOne({ name });

    console.log("fetched user Data", user);
    console.log(await user.matchPassword(password));
    if (user && (await user.matchPassword(password))) {
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        };
        console.log(response);
        res.json(response);
    } else {
        res.status(400);
        throw new Error("Invalid UserName or Password");
    }
});

const registerController = expressAsyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    // console.log( req.body);
    // console.log('email:', email);
    // console.log('password:', password);


    // Check for all fields
    if (!name || !email || !password) {
        res.sendStatus(400);
        throw Error("All necessary input fields have not been filled");
    }
    // Pre-existing user
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        throw new Error('User already Exists');
    }

    // User name already taken
    const userNameExist = await UserModel.findOne({ name });
    if (userNameExist) {
        throw new Error('User name already taken');
    }

    // Create an entry in db
    const user = await UserModel.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)

        })
    }
    else {
        res.status(400)
        throw new Error("registration error")
    }
});

// module.exports = { loginController, registerController };


const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await UserModel.find(keyword).find({
        _id: { $ne: req.user._id },
    });
    res.send(users);
});

module.exports = {
    loginController,
    registerController,
    fetchAllUsersController,
};

