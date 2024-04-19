import mongoose from "mongoose";
const {Schema} = mongoose;

const tokenSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Employee",
        unique: true
    },
    token: {
        type: String,
        required: true
    },
   
}, 
{
    timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    expires: 3600 //1 hour
}
});


export default mongoose.model("Token",tokenSchema);