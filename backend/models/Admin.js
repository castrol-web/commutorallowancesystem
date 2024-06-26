import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verified: {
        type: Boolean,
        default: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
})


export default mongoose.model('Admin', adminSchema);