// const mongoose=require('mongoose')

// const mongoDB=async()=>{
//     // mongoose.connect('mongodb+srv://prashant12540kumar:prashant@test-pro-db.m8qvl.mongodb.net/?retryWrites=true&w=majority&appName=test-pro-db')
//     mongoose.connect('mongodb://localhost:27017/RAZGOR')
//     console.log("MongoDb connected");
//     mongoose.connection.once('open', async () => {
//         try {
//             await mongoose.connection.db.collection("users");
//             console.log("hello")
//         } catch (err) {
//             console.error("Error fetching data:", err);
//         }
//     });
// }
// module.exports=mongoDB;


// mongo password  Xj3yerKDYdCHmzyE
// username  kumarparshant12540
// mongodb+srv://kumarparshant12540:Xj3yerKDYdCHmzyE@cluster0.a8q0hmj.mongodb.net/


const mongoose=require('mongoose')

const mongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/RAZGOR');
        console.log('mongoDB connected.');
    } catch (error) {
        console.log(error);
    }
}
module.exports=mongoDB;