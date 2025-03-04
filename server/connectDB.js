const mongoose=require('mongoose')

const mongoDB=async()=>{
    mongoose.connect('mongodb://localhost:27017/RAZGOR')
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