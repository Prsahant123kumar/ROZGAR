// const express = require("express");
// const dotenv = require("dotenv");
// const mongoDB = require("./connectDB");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const userRoute = require("./routes/user.route");
// const WorkersRoute = require("./routes/Workers.route");
// dotenv.config();
// const app = express();
// const http=require("http");
// const socketio=require("socket.io");
// const server=http.createServer(app);
// const io=socketio(server)
// const path=require("path")
// app.use(express.static('public'));
// app.set(express.static(path.join(__dirname, "public")));


// mongoDB();
// const PORT = process.env.PORT || 3000;
// const DIRNAME=path.resolve();
// // Middleware
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(express.json());
// app.use(cookieParser());


// const corsOptions = {
//     origin: [
//       "https://rozgar-server.onrender.com",
//       "http://localhost:5173", 
//       // "http://localhost:3000" // Add this line
//     ],
//     credentials: true,
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//     allowedHeaders: "Content-Type,Authorization",
//   };
// app.use(cors(corsOptions));

// // API Routes
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/Workers", WorkersRoute);

// // Connect to MongoDB BEFORE starting the server
// app.get("/",function(req,res) {
//     res.render("index");
// });

// app.use(express.static(path.join(DIRNAME,"/client/dist")))
// app.use("*",(_,res) => {
//   res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"));
// });

// server.listen(PORT, () => {
//     console.log(`Example app listening on port ${PORT}`)
//   })



const express = require("express");
const dotenv = require("dotenv");
const mongoDB = require("./connectDB");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const WorkersRoute = require("./routes/Workers.route");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const DIRNAME = path.resolve();

// Connect to MongoDB
mongoDB();

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "https://rozgar-rpk0.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000" 
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Serve static files from "public"
// app.use(express.static(path.join(__dirname, "public")));

// Serve static frontend files from "client/dist"

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/Workers", WorkersRoute);

app.use(express.static(path.join(DIRNAME, "client", "dist")));
// ✅ Fixed: Root Route Now Returns JSON Instead of Rendering a View
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to the API!" });
// });

// Handle React/Vue Frontend Routing
app.use("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});

// Start the Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
