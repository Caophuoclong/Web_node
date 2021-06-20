const mongoose = require('mongoose');
const uri = "mongodb+srv://phuoclong:51648951354@cluster0.fyage.mongodb.net/User?retryWrites=true&w=majority"
const connectDB = async ()=>{
	try{
		await mongoose.connect(uri,{
		useNewUrlParser: true, 
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
		})
		console.log('Mongodb connected');
	} catch(error){
		console.log(error);
		process.exit(1);
	}

	
}
module.exports = connectDB;