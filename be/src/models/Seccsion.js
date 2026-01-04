import mongoose from 'mongoose';
const seccionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);
// * tự động xóa khi hết hạn
seccionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model('Seccion', seccionSchema);
