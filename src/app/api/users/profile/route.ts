import { connectDB } from "@/db/dbConnect";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { dataFromToken } from "@/utils/datafromtoken";

connectDB();

export async function POST(request: NextRequest) {
    const userId = dataFromToken(request);
    const user = await User.findOne({_id: userId }).select("-password");
    
    if(!user) return NextResponse.json({error: "User not found"}, {status: 404});
    return NextResponse.json({user}, {status: 200});
}