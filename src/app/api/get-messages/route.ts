import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendApiResponse } from "@/lib/sendApiReponse";
import { Types } from "mongoose";
import User from "@/models/user.model";

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

    const userMessages = await User.aggregate([
      {
        $match: { _id: new Types.ObjectId(user._id) },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]).exec();

    return sendApiResponse({
      success: true,
      message: "Messages fetched successfully",
      data: userMessages[0]?.messages || [],
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
