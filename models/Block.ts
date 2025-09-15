import mongoose, {Schema, Document} from 'mongoose';

export interface IBlock extends Document{
    userId: string;
    userEmail: string;
    startAt: Date;
    endAt: Date;
    timezone? : string;
    reminderScheduledAt: Date;
    reminderSent: boolean;
    reminderSentAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>({
    userId: {type: String, required: true, index:true},
    userEmail: {type: String, required: true},
    startAt: {type: Date,required: true},
    endAt: {type: Date, required: true},
    timezone: {type: String, default: "UTC"},
    reminderScheduledAt: {type: Date, required: true, index:true},
    reminderSent: {type: Boolean,default: false, index: true},
    reminderSentAt: {type: Date, default: null}
},{
    timestamps: true
});

BlockSchema.index({reminderScheduledAt: 1, reminderSent: 1});
BlockSchema.index({userId: 1,startAt:1, endAt: 1});

const Block = mongoose.models.Block || mongoose.model<IBlock>('Block',BlockSchema);

export default Block;