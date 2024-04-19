import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "Employee",
        required: true,
        unique: true
    },
    validUntil: {
        type: Date,
        required: true,
        index: true // Adding indexing for checking document expiration
    },
    insuranceProvider: {
        type: String,
        required: true
    },
    insurancePolicyNumber: {
        type: String,
        required: true
    },
    insuranceImagePath: {
        type: String
    },
    insuranceType: {
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
});

export default mongoose.model("Insurance", insuranceSchema);
