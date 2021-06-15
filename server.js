const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');
const crypto = require('crypto');
const bp = require('body-parser');
const axios = require('axios');
const uri = "mongodb+srv://phuoclong:51648951354@cluster0.fyage.mongodb.net/User?retryWrites=true&w=majority"
const db_name = "User";
const collection_name = "Test";
const algorithm = "sha512";

function deleteDB() {
    mongo.connect(uri, (err, client) => {
        const db = client.db(db_name);
        db.collection(collection_name).deleteMany({}, (err, collection) => {
            console.log("Deleted all db");
        })
    })
}

app = express();
let port1 = '';
const server = require("http").Server(app);
server.listen(process.env.PORT || 8080, () => {


});

const api_key = "ce86fa1d45f983171c0b9a235b6a4a22";
global.l = ''

let list_user = [];
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on("add_user",(data)=>{
        socket.UserName = data;
        if(list_user.indexOf(data) < 0)
            list_user.push(data);
        io.emit("add_success",list_user);
    })
    socket.on("disconnect",()=>{
        list_user.splice(list_user.indexOf(socket.UserName),1);
        console.log(list_user);
        console.log(socket.UserName);
        io.emit("add_success",list_user);


    })
    socket.on('signup', (data) => {
        console.log(data);
        mongo.connect(uri, (err, client) => {
            if (err) throw err;
            const db = client.db(db_name);
            db.collection(collection_name).findOne({ "username": data.data }, (err, collection) => {
                if (collection != null) {
                    // console.log(collection);
                    socket.emit('signup', { 'data': '1' });

                } else {
                    socket.emit('signup', { 'data': '0' });


                }
            })


        })
    });
    socket.on("check_tai_khoan", (data) => {
        if (data != null) {
            mongo.connect(uri, (err, client) => {
                db = client.db(db_name);
                db.collection(collection_name).findOne({ username: data }, (err, collection) => {
                    if (collection == null)
                        socket.emit("check_tai_khoan");
                })
            })

        }

    })
    socket.on("weather", (data) => {
        let lat = data.lat;
        let lon = data.long;
        let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
        axios.get(url).then(response => {
            let data = response.data;
            weather = data.weather;
            weather.forEach(r => {
                l = r.icon;
            })
            temp = data.main.temp;
            speed = data.wind.speed;
            sunrise = data.sys.sunrise;
            sunset = data.sys.sunset;
            name = data.name;
            time_sunrise = new Date(sunrise * 1000);
            time_sunset = new Date(sunset * 1000);
            hour_rise = time_sunrise.getHours();
            hour_set = time_sunset.getHours();
            minutes_rise = time_sunrise.getMinutes();
            minutes_set = time_sunset.getMinutes();
            time_rise = hour_rise + ":" + minutes_rise;
            time_set = `${hour_set}:${minutes_set}`
            const x = {
                name: name,
                speed: (speed * 3.6).toFixed(2),
                temp: temp - 273.15,
                sunrise: time_rise,
                sunset: time_set,
                icon: l,

            }
            socket.emit("weather", x);

        })
    })
    socket.on("send-chat",(data)=>{
        socket.userName = data.name;
        data = {
            data : data.data,
            name: data.name,
        }
        io.emit("rep-chat",data);
    })
   
})


app.set("view engine", "ejs");
app.set("views", "./views");
app.set(session('trust proxy', 1));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //secure: true 
    }
}))
app.use(express.static(path.join(__dirname, 'static'))); // add to load static file
app.use(bp.json());
app.use(bp.urlencoded({ extend: true }));

const getHash = (text, phone) => {
    let hmac = crypto.createHmac(algorithm, phone);
    let data = hmac.update(text);
    let gen_hash = data.digest('hex');
    return gen_hash;
}



app.get('/', (req, res) => {
    res.render('index');
})
app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/dashboard', (req, res) => {
    if (req.session.isAuthenticated)
        res.render('dashboard', { 'name': req.session.authUser.name });
    else
        res.redirect('/login');
})
app.get('/logout', (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/');
    })
})

app.post('/signup', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let phone = req.body.password;
    let pass = getHash(password, phone);
    let data = {
        "name": name,
        "username": username,
        "password": pass,
        "phone": phone
    }
    mongo.connect(uri, (err, client) => {
        if (err) throw err;
        const db = client.db(db_name);
        db.collection(collection_name).findOne({ "username": username }, (err, collection) => {
            if (collection != null)
                res.render('maybingua');
            else {
                db.collection(collection_name).insertOne(data, (err, collection) => {
                    if (err) throw err;
                    console.log("Inert successfully");
                    res.redirect('/');
                })
            }
        })

    })
})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    mongo.connect(uri, (err, client) => {
        const db = client.db(db_name);
        db.collection(collection_name).findOne({ 'username': username }, (err, collection) => {
            if (collection != null) {
                let pass = getHash(password, collection.phone);
                if (pass === collection.password) {
                    req.session.isAuthenticated = true;
                    req.session.authUser = collection;
                    res.redirect('dashboard');

                } else {
                    res.render("login_error")

                }
            } else
                res.render("login_error");
        })
    })
})
