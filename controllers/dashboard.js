const Rooms = require('../models/rooms');
module.exports = {
	index: async (req,res)=>{
		if(req.session.isAuthenticated)
		{
			const array = []
			const room = await Rooms.find();
			for(x in room)
					array.push(room[x]);
			console.log(array);
			res.render('dashboard',{data: req.session.authUser, room: array});
		}
		else{
			res.redirect('login');
		}
	}
}