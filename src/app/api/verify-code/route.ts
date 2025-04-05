import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";

const CodeQuerySchema = z.object({
  username: usernameValidation,
  code: verifySchema.shape.code,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    // using zod
    const parsedData = CodeQuerySchema.safeParse(body);
    console.log(parsedData); //TODO: remove
    if (!parsedData.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid input data",
          errors: parsedData.error.errors,
        },
        { status: 400 }
      );
    }

    const{username, code } = parsedData.data;

    const user = await UserModel.findOne({ username });

    // if user doesn't exist throw error
    if (!user) {
      return Response.json(
        {
          success: false,
          message: `User with ${username} does not exists`,
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      (user.isVerified = true), await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verification successfull",
        },
        { status: 200 }
      );
    }
    // code is expired
    else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired please sign up again to get a new code",
        },
        { status: 400 }
      );
    }
    // code is incorrect
    else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying Code", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      { status: 500 }
    );
  }
}
