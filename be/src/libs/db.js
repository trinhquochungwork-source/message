import mongoose from 'mongoose';
export const connectBD = async () => {
    try {
        await mongoose.connect(process.env.DB_CONECTION);
        console.log('Kết nối DB thành công !');
    } catch (error) {
        console.log('Kết nối DB không thành công !', error);
        process.exit(1);
    }
};
