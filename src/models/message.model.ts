import { Document, model, models, Schema } from "mongoose";

export interface TMessage extends Document {
  content: string;
  createdAt: Date;
}

export const MessageSchema: Schema<TMessage> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Message = models.Message || model<TMessage>("Message", MessageSchema);
export default Message;
