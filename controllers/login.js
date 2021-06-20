module.exports = {
	 login: async(req,res)=>{
	 	console.log(req.session.isAuthenticated);
		if(req.session.isAuthenticated)
		res.redirect('/dashboard');
		else
			res.render('login')
	}
}