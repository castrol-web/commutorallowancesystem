import express from "express";
import Employee from "../models/Employee.js";
import Inspection from "../models/Inspection.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Logbook from "../models/Logbook.js";
import Insurance from "../models/Insurance.js";
import Licence from "../models/Licence.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

//admin router
const router = express.Router();

//aws credentials
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;

//s3 object 
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: region
});

//admin signup
router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    try {
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: "admin with given email already exist" });
        }
        // generating salt for the password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        //hashing password
        const hashPassword = await bcrypt.hash(password, salt);
        //sending the object to the DB
        admin = await new Admin({
            username,
            email,
            password: hashPassword
        }).save();

        //generating token 
        const token = jwt.sign({ _id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET_KEY);


        res.status(201).json({ token, message: "Admin created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//signin
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        //checking password validity
        const validPassword = await bcrypt.compare(
            password, admin.password
        );
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //sign Jwt token
        const token = jwt.sign({ _id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ token, message: "signed in successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//fetch all employees/users in the database
router.get("/employees", async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        //verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const employees = await Employee.find();
        if (!employees) {
            return res.status(404).json({ message: "no employees found" });
        }
       return res.status(200).json({ employees });
    } catch (error) {
        console.log(error);
       return res.status(500).json({ message: "internal server error" });
    }
});


//get pending inspections 
router.get("/Inspections", async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        //verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const pendingInspections = await Inspection.find({ status: 'Pending' })
            .populate("employee")
            .populate("logbook")
        if (!pendingInspections || pendingInspections.length === 0) {
            return res.status(404).json({ message: "No pending inspections found" });
        }
        res.status(200).json({ pendingInspections });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get("/showdocument/:id", async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        //verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        //finding pending documents
        const pendingInspections = await Inspection.find({ status: 'Pending' })
            .populate("logbook")
        if (!pendingInspections || pendingInspections.length === 0) {
            res.status(404).json({ message: "No pending inspections found" });
        }
        const id = req.params.id;
        //finding the logbook of that user Id
        const logbook = await Logbook.findOne({ userId: id });
        const insurance = await Insurance.findOne({ userId: id });
        const licence = await Licence.findOne({ userId: id });
        if (!logbook || !insurance || !licence) {
            res.status(404).json({ message: "On or more documents missing found" });
        }
        const logbookPath = logbook.logbookImage;
        const licencePath = licence.licenceImagePath;
        const insurancePath = insurance.insuranceImagePath;
        //getting the image urls from s3 bucket
        const logbkUrl = await generateSignedUrl(logbookPath);
        const licenceUrl = await generateSignedUrl(licencePath);
        const insuranceUrl = await generateSignedUrl(insurancePath);
        res.status(200).json({ logbook, logbkUrl, licence, licenceUrl, insurance, insuranceUrl });
    } catch (error) {
        console.error(error);
    }
});

//approve or reject documents document
router.put("/confirm-documents/:id", async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        //verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        //getting user's id
        const id = req.params.id;
        //update the inspection to confirmed
        const updatedInspection = await Inspection.findOneAndUpdate({ employee: id }, { status: 'Confirmed' }, { new: true });
        //update documents status
        const updatedLogbook = await Logbook.findOneAndUpdate({ userId: id }, { status: 'Confirmed' }, { new: true });
        const updatedInsurance = await Insurance.findOneAndUpdate({ userId: id }, { status: 'Confirmed' }, { new: true });
        const updatedLicence = await Licence.findOneAndUpdate({ userId: id }, { status: 'Confirmed' }, { new: true });
        //if  not updated
        if (!updatedInspection || !updatedLogbook || !updatedInsurance || !updatedLicence) {
            return res.status(404).json({ message: "Error Approving documents" });
        }

        res.status(200).json({
            message: "Inspection Approved Successfully", Inspection: updatedInspection, Logbook: updatedLogbook,
            Insurance: updatedInsurance, Licence: updatedLicence
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});


//approve or reject documents document
router.put("/reject-documents/:id", async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        //verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        //getting user's id
        const id = req.params.id;
        //update the inspection to confirmed
        const updatedInspection = await Inspection.findOneAndUpdate({ employee: id }, { status: 'Rejected' }, { new: true });
        //update documents status
        const updatedLogbook = await Logbook.findOneAndUpdate({ userId: id }, { status: 'Rejected' }, { new: true });
        const updatedInsurance = await Insurance.findOneAndUpdate({ userId: id }, { status: 'Rejected' }, { new: true });
        const updatedLicence = await Licence.findOneAndUpdate({ userId: id }, { status: 'Rejected' }, { new: true });
        //if  not updated
        if (!updatedInspection || !updatedLogbook || !updatedInsurance || !updatedLicence) {
            return res.status(404).json({ message: "Error Approving documents" });
        }

        res.status(200).json({
            message: "Inspection Rejected Successfully", Inspection: updatedInspection, Logbook: updatedLogbook,
            Insurance: updatedInsurance, Licence: updatedLicence
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

//logout function 
router.post("/logout", async (req, res) => {
    try {
        //clear jwt token form local storage
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//fuction to get signed url from aws
async function generateSignedUrl(imageUrl) {
    // Object params to fetch image 
    const getObjectParams = {
        Bucket: bucketName,
        Key: imageUrl
    };

    // Command to fetch the image from AWS
    const command = new GetObjectCommand(getObjectParams);
    // Fetching the URL for the image
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
}







//export router
export default router;