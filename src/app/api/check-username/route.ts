import dbConnect from "@/lib/dbConnect";
import { sendApiResponse } from "@/lib/sendApiReponse";
import User from "@/models/user.model";
import * as zod from "zod";

const checkUsernameSchema = zod.object({
  username: zod.string({
    required_error: "Please provide a username",
    invalid_type_error: "Username must be a string",
  }),
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const queryParam = {
      username: searchParams.get("username"),
    };
    const validatedQueryParam = checkUsernameSchema.safeParse(queryParam);
    if (!validatedQueryParam.success) {
      const error = validatedQueryParam.error.format().username?._errors || [];
      return sendApiResponse({
        success: false,
        message: error ? error.join(", ") : "Please provide a username",
        statusCode: 400,
      });
    }

    const { username } = validatedQueryParam.data;

    const userExistByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (userExistByUsername) {
      return sendApiResponse({
        success: false,
        message: "Username already taken.",
        statusCode: 400,
      });
    }

    return sendApiResponse({
      success: true,
      message: "Username is available.",
      statusCode: 200,
    });
  } catch (error: any) {
    console.error("Error in check-username", error);
    return sendApiResponse({
      success: false,
      message: error.message,
      statusCode: 400,
    });
  }
}
