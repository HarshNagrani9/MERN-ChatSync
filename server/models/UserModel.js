import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is requires"],
        unique: true,
    },
    password:{
        type:String,
        required:[true, "Password is requires"],
    },
    firstName:{
        type:String,
        required:false,
    },
    lastName:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:Number,
        required:false,
    },
    profileSetup:{
        type: Boolean,
        default: false,
    },
    //The need of profile setup is to check in the auth that if the user is not registered then 
    // he won't be able to chat 
    //While sign up we require all the first name, last name and color and all
    //but while logging in we only need email and password
});

userSchema.pre("save", async function(next){
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
    // This whole process was to encrypt the password we will be saving in the database
    //Also it is required to call the next function so that we can tell the script that
    // our encryption is done and now u can proceed with the rest of the code otherwise our
    //program will stop at line 42.
})

const User = mongoose.model("Users", userSchema);
//this is where we are connecting our schema with the MongoDB

export default User;