import { NextResponse } from "next/server";

interface IApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: any;
}

export const sendApiResponse = (response: IApiResponse) => {
  return NextResponse.json(
    {
      success: response.success,
      message: response.message,
      data: response.data,
    },
    {
      status: response.statusCode,
    }
  );
};
