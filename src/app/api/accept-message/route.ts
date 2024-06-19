import dbConnect from "@/lib/dbConnect";
import { sendApiResponse } from "@/lib/sendApiReponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/user.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user && !session) {
      return sendApiResponse({
        success: false,
        message: "You are not authenticated",
        statusCode: 404,
      });
    }

    const { isAcceptingMessages } = await req.json();

    if (typeof isAcceptingMessages !== "boolean") {
      return sendApiResponse({
        success: false,
        message: "Invalid data",
        statusCode: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        isAcceptingMessages,
      },
      {
        new: true,
      }
    );

    return sendApiResponse({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
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

export async function GET(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user && !session) {
      return sendApiResponse({
        success: false,
        message: "You are not authenticated",
        statusCode: 404,
      });
    }

    const foundUser = await User.findOne({
      _id: user._id,
    });

    return sendApiResponse({
      success: true,
      message: "This user are accepting messages",
      data: foundUser?.isAcceptingMessages,
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
