const express = require('express');
const app = express();
const server = require('http').Server(app);
const bp = require('body-parser');
const path = require('path');
const axios = require('axios');
const io = require('socket.io')(server);
const session = require('express-session');
const cookieParser = require('cookie-parser');
const user_router = require('./routes/user');
const index_router = require('./routes/index');
const login_router = require('./routes/login');
const signup_router = require('./routes/signup')
const dashboard_router = require('./routes/dashboard');
const auth_router = require('./routes/auth');
const connectDB = require('./db/database');
const logout_router = require('./routes/logout');
const Chat = require('./models/chat');
server.listen(process.env.PORT || 3000);

app.set(session('trust_prox', '1'))
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, '/static')));
app.use(bp.json());
app.use(bp.urlencoded({ extend: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //secure: true 
    }
}))
connectDB();
io.on('connection', (socket)=>{
    socket.on('joinroom',async (room)=>{
        socket.join(room);
        const chat = await Chat.find({inRoom:room});
        console.log(chat);
        io.to(room).emit('join-success',chat);
    })
    socket.on('send',async data=>{
        const {username,message,room} = data;
        const chat = new Chat({text: message,owner:username,inRoom:room})
        await chat.save();
        socket.broadcast.to(room).emit('reply',{username,message});
    })
})
app.use('/', index_router);
app.use('/users', user_router);
app.use('/login', login_router);
app.use('/signup', signup_router);
app.use('/api/auth', auth_router);
app.use('/dashboard', dashboard_router);
app.use('/logout',logout_router);