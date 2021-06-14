const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');
const crypto = require('crypto');
const bp = require('body-parser');

const uri = "mongodb+srv://phuoclong:51648951354@cluster0.fyage.mongodb.net/User?retryWrites=true&w=majority"
const db_name = "User";
const collection_name = "Test";
const algorithm = "sha512";

function deleteDB(){
    mongo.connect(uri,(err, client)=>{
        const db = client.db(db_name);
        db.collection(collection_name).deleteMany({ }, (err, collection)=>{
            console.log("Deleted all db");
        })
    })
}

app = express();
const server = require("http").Server(app);
server.listen(process.env.PORT || 8080);
const io = require('socket.io') (server);
io.on('connection',(socket)=>{
    console.log(`${socket.id} dang ket noi`);
    socket.on('signup',(data)=>{
        console.log(data);
        mongo.connect(uri, (err, client) => {
        if (err) throw err;
        const db = client.db(db_name);
        db.collection(collection_name).findOne({ "username": data.data }, (err, collection) => {
            if (collection != null){
               // console.log(collection);
                socket.emit('signup',{'data':'1'});

            }
            else{
                socket.emit('signup',{'data':'0'});
                
            
        }
            })

    })

    });

})


app.set("view engine", "ejs");
app.set("views", "./views");
app.set(session('trust proxy',1));


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
    res.render('index')
})
app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/dashboard', (req, res) => {
	if(req.session.isAuthenticated)
    	res.render('dashboard',{'name': req.session.authUser.name});
   	else
   		res.redirect('/login');
})

app.post('/signup', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let phone = req.body.password;
    let pass = getHash(password, phone);
    let data = {
        "name" : name,
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

app.post('/login', (req, res)=>{
	let username = req.body.username;
	let password = req.body.password;
	mongo.connect(uri,(err, client)=>{
		const db = client.db(db_name);
		db.collection(collection_name).findOne({'username' : username }, (err, collection)=>{
			if (collection != null){
				let pass = getHash(password, collection.phone);
				if (pass = collection.password){
					req.session.isAuthenticated = true;
					req.session.authUser = collection;
					res.redirect('dashboard');

				}
				else
					res.send("Sai ten tai khoan hoac mat khau");
			}
			else
				res.send("Sai ten tai khoan hoac mat khau");
		})
	})
})