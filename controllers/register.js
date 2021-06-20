const getHash = require('../hashpassword/hash');
const randomString = require('randomstring');
const User = require('../models/user');
const crypto = require('crypto');
const algorithm = "sha512";

module.exports = {
    register: async (req, res) => {
    	req.body.salt = randomString.generate();
        const {name, username, password,salt} = req.body;
        if(!username || !password) res.status(400).json({success: false, message: 'Missing user name and/or password'})
    	try{
    		//check exitsting username
    		const user = await User.findOne({username});
    		if(user) return res.status(400).json({success: false, message: 'Username has been taken'});
    		const newPasswrod = getHash(password,salt);
    		//password = newPasswrod;
    		const newUser = new User({name, username,password : newPasswrod,salt});
    		await newUser.save();
    		
    		return res.redirect('/');

    	}catch(error){
    		console.log(error);

    	}
    },
    login: async (req,res)=>{
    	const {username,password} = req.body;
    	console.log(username);
    	if(!username || !password) res.render('login_error');
    	else{
    		try{
    			const user = await User.findOne({username});
    			if(!user) res.render('login_error');
    			const salt = user.salt;
    			console.log(user.name);
    			if(user.password === getHash(password,salt)){
    				req.session.isAuthenticated = true;
    				req.session.authUser = user;
    				res.redirect('/dashboard');

    			}

    		}catch(error){
    			console.log(error);
    		}
    	}
    }

}