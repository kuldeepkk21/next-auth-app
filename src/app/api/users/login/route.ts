import { connectDB } from "@/db/dbConnect";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 400 });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Password is incorrect" }, { status: 400 });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.TOKEN_SECRET_KEY!,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({ token, message: "Login successful", success: true }, { status: 200 });
        
        response.cookies.set("token", token, { httpOnly: true, secure: true });
        
        return response;
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}