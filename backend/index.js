const express = require('express');
const dotenv = require('dotenv');
const app = express();

const cors = require('cors');
// Enable CORS for all routes
app.use(cors());

// mongoDB
const { default: mongoose } = require("mongoose");
// routing
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");


//environment variables 
dotenv.config();

app.use(express.json());

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());


// const MONGO_URI = process.env.MONGO_URI;
// console.log(MONGO_URI);
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log('server is connected to DB');
    }
    catch (err) {
        console.log('server is not connected to DB', err.message);
    }
};
connectDB();



app.get('/', (req, res) => {
    res.send('api is running...')
})


// // Routing
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log("server is running...");
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
    pingTimeout: 60000,
});

io.on("connection", (socket) => {

    socket.on('setup', (user) => {
        socket.join(user.data._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
    })

    socket.on('new message', (newMessageStatus) => {
        var chat = newMessageStatus.chat;
        if (!chat.users) {
            return console.log("chat.users not defined");
        }
        chat.users.forEach((user) => {
            if (user._id == newMessageStatus.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

});

