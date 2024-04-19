//employee schema 
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const EmployeeSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    department: { type: String, required: true },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    MarriageCertificate: String,
    nationalID: {
        type: Number,
        required: true,
        unique: true
    },
    MaritalStatus: { type: String, required: true },
    KRA: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

//authentication token
// EmployeeSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
//     return token
// }


//employee table created
export default mongoose.model("Employee", EmployeeSchema);
