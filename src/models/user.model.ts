import { Document, Model, model, models, Schema } from "mongoose";
import { MessageSchema, TMessage } from "./message.model";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: TMessage[];
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
