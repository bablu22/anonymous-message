import dbConnect from "@/lib/dbConnect";
import { sendApiResponse } from "@/lib/sendApiReponse";
import User from "@/models/user.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { code, username } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await User.findOne({ username: decodedUsername });
    if (!user) {
      return sendApiResponse({
        success: false,
        message: "This username does not valid.",
        statusCode: 404,
      });
    }
    const isValidCode = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpires) < new Date();

    if (!isValidCode || isCodeExpired) {
      return sendApiResponse({
        success: false,
        message: "Invalid code or code is expired.",
        statusCode: 400,
      });
    }

    user.isVerified = true;
    await user.save();

    return sendApiResponse({
      success: true,
      message: "User verified successfully.",
      statusCode: 200,
    });
  } catch (error: any) {
    return sendApiResponse({
      success: false,
      message: error.message || "Something went wrong",
      statusCode: 400,
    });
  }
}
