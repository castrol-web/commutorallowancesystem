import mongoose from "mongoose";

const LogbookSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref:"Employee",
        required: true,
        unique: true
    },
    logbookImage:{
        type: String,
        required: true
    },
    modelNumber: {
        type: String,
        required: true
    },
    chasisNumber:{
        type: String,
        required: true
    },
    vehicleMake:{
        type: String,
        required: true
    },
    engineNumber:{
        type: String,
        required: true
    },
    ownerName:{
        type: String,
        required: true 
    },
    isOwnerDriver:{
        type: Boolean,
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


export default mongoose.model("Logbook",LogbookSchema);