import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { sendApiResponse } from "@/lib/sendApiReponse";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();
    const userExistByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (userExistByUsername) {
      return sendApiResponse({
        success: false,
        message: "Username already taken.",
        statusCode: httpStatus.BAD_REQUEST,
      });
    }
    const userExistByEmail = await User.findOne({
      email,
    });
    const verifyCode = Math.random().toString(36).substr(2, 6); // 6digit
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1hour

    if (userExistByEmail) {
      if (userExistByEmail.isVerified) {
        return sendApiResponse({
          success: false,
          message: "User already exists with this email. Please login.",
          statusCode: httpStatus.BAD_REQUEST,
        });
      } else {
        userExistByEmail.verifyCode = verifyCode;
        userExistByEmail.verifyCodeExpiry = verifyCodeExpiry;
        await userExistByEmail.save();
      }
    } else {
      const user = new User({
        username,
        email,
        verifyCode,
        verifyCodeExpiry,
        password,
      });
      await user.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return sendApiResponse({
        success: false,
        message: "Failed to send verification email. Please try again.",
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return sendApiResponse({
      success: true,
      message: "Verification email sent successfully.",
      statusCode: httpStatus.OK,
    });
  } catch (error) {
    console.error(`Failed to send verification email: ${error}`);
    return sendApiResponse({
      success: false,
      message: "Failed to send verification email. Please try again.",
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
