import { connectDB } from "@/db/dbConnect";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/mailer";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();
        console.log(username, email, password);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({ 
            username, email, password: hashedPassword 
        });
        const savedUser = await newUser.save();
        console.log(savedUser);

        // send verification email 

        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

        return NextResponse.json({
            message: "User registered successfully",
            user: savedUser,
            success: true 
            },
            { status: 201 }
        );     
    } catch (error: any) {
        console.log("error occured", error);
        
        return NextResponse.json({ 
            message: "Error registering user",
            success: false,
            error: error
        }, { status: 500 });
    }
}
