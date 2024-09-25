import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactsRoutes from "./routes/ContactRoutes.js"
import setupSocket from "./socket.js"
import messagesRoutes from "./routes/MessagesRoutes.js"
dotenv.config()

const app = express();
const port = process.env.PORT || 3001
const databaseURL =  process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
})
);

// To ensure that we use cookies we put credentials = true

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"))
//Basically here what we mean is whenever user tries to call this route
//we will serve him the image which is already in our directory

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use("/api/contacts", contactsRoutes)
app.use("/api/messages", messagesRoutes)

const server = app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

setupSocket(server);


mongoose.connect(databaseURL).then(() => console.log("DB connection success")).catch(err => console.log(err.message));