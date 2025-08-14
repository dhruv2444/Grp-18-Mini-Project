const mongoose = require('mongoose')


const ConnectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected Successfully")
    }
    catch(err){
        console.log("error to connect mongoose",err.message);
        process.exit(1)
    }
}

module.exports = ConnectDB;