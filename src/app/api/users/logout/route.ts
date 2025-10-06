import { connectDB } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {

        const response = NextResponse.json({ message: "Logout successful", success: true }, { status: 200 });
        
        response.cookies.set("token", "", { httpOnly: true, secure: true, expires: new Date(0) });
        
        return response;
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}