import express from "express";
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import Token from "../models/Token.js";
import multer from "multer";
import sendEmail from "../util/SendEmail.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import Logbook from "../models/Logbook.js";
import Insurance from "../models/Insurance.js";
import Licence from "../models/Licence.js";
import jwt from "jsonwebtoken"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Inspection from "../models/Inspection.js";
import Contacts from "../models/Contacts.js";
//router from express that is going to be used inside the server.js
const router = express.Router()

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

//storage for image upload in memory
const storage = multer.memoryStorage();

// File type checking function
function isImage(fileBuffer) {
    const type = fileType(fileBuffer);
    return type && ['image/jpeg', 'image/png', 'image/bmp'].includes(type.mime);
}


//function that generates random image names 
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


const upload = multer({ storage: storage });
//registration
router.post("/signup", async (req, res) => {
    try {
        if (req.file) {
            const marriageCertificate = req.file;
        }

        // checking user existence
        let user = await Employee.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ message: "User with given email already exists!" });
        }
        // generating salt for the password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // sending the employee obj to the db
        user = await new Employee({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            department: req.body.department,
            phone: req.body.phone,
            email: req.body.email,
            nationalID: req.body.nationalID,
            MaritalStatus: req.body.MaritalStatus,
            KRA: req.body.KRA,
            password: hashPassword,
        }).save();

        // token
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()

        // url generation
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

        // sending email
        await sendEmail(user.email, "Verify Email", url);

        res.status(201).json({ message: "Verification Email has been sent to your account, please verify" });
    } catch (err) {
        console.error("Error:", err);
        if (err instanceof EmailSendingError) {
            return res.status(500).json({ message: "Error sending email. Please try again later." });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//logbook submission
router.post("/Logbook", upload.single('logbookImage'), async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        //fetching user entered details from the frontend
        const { modelNumber, chasisNumber, vehicleMake, engineNumber, ownerName, isOwnerDriver } = req.body; //user details

        //verifing user token if is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id;
        const user = await Employee.findById({ _id: userId });
        if (!user) {
            console.log("user not found");
            return res.status(404).json({ message: "unauthorised" });
        }
        // const logbk = await Logbook.find({ userId: userId });
        // if (logbk) {
        //     console.log("logbook with same id found")
        //     return res.status(403).json({ message: "same logbook id found" })
        // }

        const logbookImage = randomImageName();
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "file not found" });
        }
        //buffer prop that we will send to s3 object
        const params = {
            Bucket: bucketName,
            Key: logbookImage,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }
        //upload picture to S3
        const command = new PutObjectCommand(params)
        await s3.send(command);

        // Create a new logbook entry with userId
        const newLogbook = new Logbook({
            modelNumber,
            chasisNumber,
            vehicleMake,
            engineNumber,
            ownerName,
            isOwnerDriver,
            logbookImage,
            userId: user._id// Associate logbook entry with the authenticated user
        });


        // Save the logbook entry within the transaction
        await newLogbook.save();
        res.status(201).json({ message: "Logbook submitted successfully" });
    } catch (error) {
        //Multer errors
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_TYPES") {
            return res.status(400).json({ message: "Invalid file type.Please upload a valid image" });
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




//insurance submission
router.post("/insurance", upload.single('insuranceImagePath'), async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        //verifying token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id; //getting the user id in the token
        //finding the user with the id above in the database 
        const user = Employee.findById({ _id: userId })
        if (!user) {
            console.log("user not found");
            return res.status(404).json({ message: "unauthorised" });
        }
        const { validUntil, insuranceProvider, insurancePolicyNumber, insuranceType } = req.body;
        //assigning image path to random names 
        const insuranceImagePath = randomImageName();
        //checking if the image is uploaded or not
        if (!req.file) {
            return res.status(400).json({ message: "file not found" });
        }
        //buffer props that will be sent to the s3 bucket
        const params = {
            Bucket: bucketName,
            Key: insuranceImagePath,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        //command for sending the image to s3
        const command = new PutObjectCommand(params);
        //sending to s3
        await s3.send(command);
        //Validate request body
        if (!validUntil || !insuranceProvider || !insurancePolicyNumber || !insuranceType) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const insuranceEntries = new Insurance({
            validUntil,
            insuranceProvider,
            insurancePolicyNumber,
            insuranceType,
            insuranceImagePath,
            userId: userId
        });

        //saving logbook entries
        await insuranceEntries.save();
        res.status(201).json({ message: "submitted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

//licence submission
router.post("/licence", upload.single('licenceImagePath'), async (req, res) => {
    //authenticating the user
    const token = req.headers["x-access-token"];
    try {
        const { licenceValid } = req.body;
        //decoding the token to verify it
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //getting the user id from the token
        const userId = decoded._id;
        //getting user from the database
        const user = await Employee.findById({ _id: userId });
        if (!user) {
            console.log("user not found");
            return res.status(404).json({ message: "unauthorised" });
        }
        //giving uploaded image a random name
        const licenceImagePath = randomImageName();
        //checking if the image is submitted by the user 
        if (!req.file) {
            return res.status(400).json({ message: "file not found" });
        }

        //params to be sent to s3
        const params = {
            Bucket: bucketName,
            Key: licenceImagePath,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        //command to put the params
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const newLicence = new Licence({
            licenceValid,
            licenceImagePath,
            userId: user._id
        });

        console.log("New licence entry:", newLicence);

        //saving entries
        await newLicence.save();
        res.status(201).json({ message: "submitted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

//employee details
router.get("/employeedetails/:id", async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
        //decode token
        const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id;
        const employee = await Employee.find({ _id: userId });
        if (!employee) {
            console.log("user not found");
            return res.status(404).json({ message: "unauthorised" });
        }

        res.status(200).json({ employee });

    } catch (error) {
        console.log(error)
    }
})






//router to get documents submitted by the user
router.get("/myuploads/:userId", async function (req, res) {
    //validating the user 
    const token = req.headers["x-access-token"];
    try {
        //verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded._id;
        //finding that employee in the database
        const user = await Employee.findById({ _id: userId });
        if (!user) {
            console.log("user not found");
            return res.status(404).json({ message: "unauthorised" });
        }

        // Fetching logbook
        const logbook = await Logbook.findOne({ userId: userId });
        if (!logbook) {
            return res.status(404).json({ message: "no logbook found" });
        }
        const logbookImageUrl = logbook.logbookImage;
        const logbookUrl = await generateSignedUrl(logbookImageUrl);

        // Fetching licence
        const licence = await Licence.findOne({ userId: userId });
        if (!licence) {
            return res.status(404).json({ message: "no licence found" });
        }
        const licenceImageUrl = licence.licenceImagePath;
        const licenceUrl = await generateSignedUrl(licenceImageUrl);

        // Fetching insurance
        const insurance = await Insurance.findOne({ userId: userId });
        if (!insurance) {
            return res.status(404).json({ message: "insurance not yet uploaded" });
        }
        const insuranceImageUrl = insurance.insuranceImagePath;
        const insuranceUrl = await generateSignedUrl(insuranceImageUrl);

        res.status(200).json({ logbook, logbookUrl, licence, licenceUrl, insurance, insuranceUrl });
    } catch (error) {
        console.error('Error fetching documents:', error);
       return res.status(500).json({ message: 'Internal server error' });
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


//book inspections
router.post("/book-inspection/:id", async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const employeeId = decoded._id;
        //getting the user from the database using user's Id in req.params
        const employee = await Employee.findOne({ _id: employeeId });
        if (!employee) {
          return  res.status(404).json({ message: "Oops login first!" });
        }
        const { date, time, location, userId } = req.body;
        //finding the documents
        const logbook = await Logbook.findOne({ userId: employeeId });
        const licence = await Licence.findOne({ userId: employeeId });
        const insurance = await Insurance.findOne({ userId: employeeId });
        // Check if documents exist
        if (!logbook || !licence || !insurance) {
            return res.status(404).json({ message: "Please upload all your documents before booking inspection" });
        }
        const newInspection = new Inspection({
            date,
            time,
            location,
            employee,
            logbook,
            insurance,
            licence,
        });

        //save inspection in the database
        await newInspection.save();
        res.status(201).json({ message: "Booked successfully" });

    } catch (error) {
        console.log(error);
       return res.status(500).json({ message: "Internal Server Error" });
    }
});


//contact us route 
router.post("/contact-us/:id", async (req, res) => {
    const token = req.headers["x-access-token"];
    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const employeeId = decoded._id;
        //getting the user from the database using user's Id in req.params
        const user = await Employee.find({ _id: employeeId });
        if (!user) {
           return res.status(404).json({ message: "Oops login first!" });
        }
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
           return res.status(400).json({ message: "all fields are required!" });
        }

        const newContact = new Contacts({
            name,
            email,
            subject,
            message,
            userId: employeeId,
        })

        //save contact to database
        await newContact.save();

        res.status(201).json({ message: "Feedback received successfully" })

    } catch (error) {
        console.log(error);
       return res.status(500).json({ message: "Internal Server Error" });
    }
});

//logout function 
router.post("/logout", async (req, res) => {
    try {
        //clear jwt token form local storage
        res.clearCookie('token');
       return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
       return res.status(500).json({ message: "Internal Server Error" });
    }
});


//verification link
router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await Employee.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: "Invalid link" })
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        // Log the token object
        console.log("Token object:", token);

        if (!token) {
            return res.status(400).send({ message: "Invalid link" });
        }


        if (token) {
            await Token.findOneAndDelete({
                userId: user._id,
                token: req.params.token
            })
        } else {
            console.log("Token is null or undefined");
        }
        //if link is found update the user status 
        await Employee.updateOne({ _id: user.id }, { verified: true });

        res.status(200).send({ message: "Email verified successfully" });

    } catch (error) {
        console.log(error);
       return res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;

