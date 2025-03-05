const mongoose=require('mongoose')

const mongoDB=async()=>{
    mongoose.connect('mongodb+srv://prashant12540kumar:prashant@test-pro-db.m8qvl.mongodb.net/?retryWrites=true&w=majority&appName=test-pro-db')
    console.log("MongoDb connected");
    mongoose.connection.once('open', async () => {
        try {
            await mongoose.connection.db.collection("users");
            console.log("hello")
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    });
}
module.exports=mongoDB;