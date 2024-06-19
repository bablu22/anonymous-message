import VerificationEmail from "@/templates/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email address",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error(`Failed to send verification email: ${error}`);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
};
