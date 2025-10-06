import { connectDB } from "@/db/dbConnect";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const {token} = await request.json();
        if(!token){
            return NextResponse.json({ message: "Token is required" }, { status: 400 });
        }
        const user = await User.findOne(
            {
                verifyToken: token,
                verifyTokenExpiry: { $gt: Date.now() }
            }
        );

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        console.log(user);
        
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({ message: "Email verified successfully", success: true }, { status: 200 });


    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}