import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessages:acceptMessages},
        {new:true}
    );

    if(!updatedUser){
        return Response.json({
            success:false,
            message:"Unable to find user and update message acceptance status"
        },{status:404})
    }

    return Response.json({
        success:true,
        message:"User message acceptance status updated successfully",
        updatedUser
    },{status:200});


  } catch (err) {
    console.log("Error updating message acceptance status", false);
    return Response.json(
      {
        success: false,
        message: "error updating message acceptance status",
      },
      { status: 500 }
    );
  }
}
