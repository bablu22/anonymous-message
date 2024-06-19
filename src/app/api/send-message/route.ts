import dbConnect from "@/lib/dbConnect";
import { sendApiResponse } from "@/lib/sendApiReponse";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { messageSchema } from "@/schemas/messageSchema";
import Message from "@/models/message.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, content } = await req.json();
    const user = await User.findOne({ username });

    if (!user) {
      return sendApiResponse({
        success: false,
        message: "This user does not exist",
        statusCode: 404,
      });
    }

    if (!user.isAcceptingMessages) {
      return sendApiResponse({
        success: false,
        message: "This user is not accepting messages",
        statusCode: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $push: {
          messages: {
            content,
            createdAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    );

    return sendApiResponse({
      success: true,
      message: "Message sent successfully",
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
