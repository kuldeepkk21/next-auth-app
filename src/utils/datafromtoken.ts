import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const dataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) throw new Error("No token found");

        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET_KEY!);

        return decodedToken.id;
    } catch (error) {
       throw new Error("Error in dataFromToken"); 
    }

}