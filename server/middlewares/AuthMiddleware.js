//Okayy so why are we using middlewares 
//Here we will verify the tokens before passing it to the Authcontroller 
//We we are trying to do is if we have a token with us then dont as the user to login 
//So for that we need token information we will get the info and we will verify the info here
//And if the info is correct we will send it to the AuthController

import jwt from "jsonwebtoken"

export const verifyToken = (request, response, next) =>{
    const token = request.cookies.jwt;
    if(!token) return response.status(401).send("you are not authenticated");
    jwt.verify(token, process.env.JWT_KEY, async(err, payload)=>{
        if(err) return response.status(403).send("token not valid")
            request.userId = payload.userId;
        next();
    })
}