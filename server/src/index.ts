import dotenv from "dotenv";
dotenv.config({     // configure dotenv
    path: "./.env"  // set path of env
});
import connectDB from "./config/db";
import { app } from "./config/app";
// import { io } from "./config/socket";

// starting the server
app.listen(Number(process.env.PORT) || 8000, "0.0.0.0", () => {
    console.log("Server is running on Port", Number(process.env.PORT) || 8000);
});

// starting the socket
// io.listen(8001);

// connecting to the database
connectDB();
