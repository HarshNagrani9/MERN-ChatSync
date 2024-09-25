import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import {renameSync, unlinkSync } from "fs"


const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge})
};

export const signup = async(request, response, next) => {
    try{
        const {email, password} = request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password is required");
        }
        const user = await User.create({email, password});
        //Here we are using the create function to add the user in the database
        //Here we are import the schema which we have created in UserModel.js


        //Now we send a JWT token for verifiation purpose
        response.cookie("jwt", createToken(email, user.id),{
            maxAge,
            secure:true,
            sameSite: "None",
        })

        return response.status(201).json({
            user :{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });

    }catch(err){
        console.log(err);
        return response.status(500).send("Internal server error")
    }
}

export const login = async(request, response, next) => {
    try{
        const {email, password} = request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password is required");
        }


        const user = await User.findOne({email});
        if(!user){
            return response.status(400).send("User email not found");
        }
        //Here we are using the findOne function to find the email address
        //because its login we dont have to create any user

        const auth = await compare(password, user.password);
        if(!auth){
            return response.status(400).send("Password is incorrect");
        }
        //Here we are using compare (line 57) function from bycrypt
        //Whats happening is  we are comparing the password 
        //given by the frontend and the database password from the user
        //If incorrect then we are sending them the message
    

        //Now we send a JWT token for verifiation purpose
        response.cookie("jwt", createToken(email, user.id),{
            maxAge,
            secure:true,
            sameSite: "None",
        })

        //We have changed the status from 201 to 200 because we are only validating
        return response.status(200).json({
            //Now we will be passing everything of the user since the user is now logged in
            //You can assume user ab pariwaar ka hissa ban chuka hai 
            user :{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });

    }catch(err){
        console.log(err);
        return response.status(500).send("Internal server error")
    }
};

export const getUserInfo = async(request, response, next) => {
    try{
        const userData = await User.findById(request.userId);
        if(!userData){
            return response.status(404).send("User with the given id not found");
        }

        return response.status(200).json({
            //Now we will be passing everything of the user since the user is now logged in
            //You can assume user ab pariwaar ka hissa ban chuka hai 
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        });

    }catch(err){
        console.log(err);
        return response.status(500).send("Internal server error")
    }
};

export const updateProfile = async(request, response, next) => {
    try{
        const {userId} = request;
        const {firstName, lastName, color} = request.body;
        if(!firstName || !lastName){
            return response.status(400).send("Firstname lastname and color required");
        }

        const userData = await User.findByIdAndUpdate(userId, 
            {firstName, lastName, color, profileSetup:true}, 
            {new:true,runValidators:true}
        )

        //this new:true tells the mongodb to return the new data so that we can return to the frontend

        return response.status(200).json({
            //Now we will be passing everything of the user since the user is now logged in
            //You can assume user ab pariwaar ka hissa ban chuka hai 
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color,
        });

    }catch(err){
        console.log(err);
        return response.status(500).send("Internal server error")
    }
};

export const addProfileImage = async(request, response, next) => {
    try{
        if(!request.file){
            return response.status(400).send("File is required")
        }
        const date = Date.now();
        let fileName = "uploads/profiles/"+date+request.file.originalname;
        renameSync(request.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(
            request.userId, 
            {image:fileName}, 
            {new:true, runValidators:true}
        )


        //this new:true tells the mongodb to return the new data so that we can return to the frontend

        return response.status(200).json({
            image : updatedUser.image,
        });

    }catch(err){
        console.log(err);
        return response.status(500).send("Internal server error")
    }
};

export const removeProfileImage = async(request, response, next) => {
    try{
        const {userId} = request;
        const user = await User.findById(userId);
        if(!user){
            return response.status(404).send("User not found");
        }
        if(user.image){
            unlinkSync(user.image);
        }

        user.image=null;
        await user.save();

        return response.status(200).send("profile image removed successfully");

    }catch(err){
        console.log(err);
        return response.status(500).send("Internal server error")
    }
};

export const logout = async(request, response, next) => {
    try{
        
        
        response.cookie("jwt", "", {maxAge:1, secure: true, sameSite:"None"})
        return response.status(200).send("Logout Successful");

    }catch(err){
        console.log(err);
        return response.status(500).send("Internal server error")
    }
};