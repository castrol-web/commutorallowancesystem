import express from 'express';
import Employee from "../models/Employee.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";
import Token from "../models/Token.js";
import crypto from "crypto";
import SendMail from '../util/SendEmail.js';
//router from express that is going to be used inside the server.js
const router = express.Router()


//login
router.post("/login", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        }
        //check if user is an admin
        let user = await Admin.findOne({ email: req.body.email });
        if (!user) {
            //check for normal users
            user = await Employee.findOne({ email: req.body.email });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // resend link if not verified
        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save()

                //url generation
                const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

                await SendMail(user.email, "Verify Email", url);

                return res.status(400).json({ message: "An Email has been sent to your account please verify" });
            }
        }

        // Determine user role
        const role = user instanceof Admin ? 'admin' : 'user';
        //assign jwt token
        const token = jwt.sign({ _id: user._id, email: user.email, role}, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        return res.status(200).send({token,role, message: "Logged in successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("email"),
        password: Joi.string().required().label("password")
    });
    return schema.validate(data);
}

export default router;