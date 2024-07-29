// reply.model.ts
import { Schema, model, models, Model } from 'mongoose';

export interface IReply {
  author: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<IReply>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const Reply: Model<IReply> = models.Reply || model<IReply>('Reply', replySchema);

export default Reply;
