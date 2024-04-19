import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    logbook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Logbook',
        required: true
    },
    insurance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Insurance',
        required: true
    },
    licence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Licence',
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Rejected"],
        default: "Pending"
    }
});

export default mongoose.model("Inspection", inspectionSchema);