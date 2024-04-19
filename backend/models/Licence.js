import mongoose from "mongoose";

const licenceSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "Employee",
        required: true,
        unique: true
    },
    licenceValid: {
        type: Date,
        required: true
    },
    licenceImagePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Rejected"],
        default: "Pending"
    }
},
{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
}
);

export default mongoose.model("Licence", licenceSchema);