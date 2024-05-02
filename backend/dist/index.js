"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
// Store OTPs in a simple in-memory object
const otpStore = {};
// Endpoint to generate and log OTP
app.post('/generate', (req, res) => {
    const email = req.body.email;
    if (!email) {
        res.status(411).json({
            message: "Please enter a valid email"
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`otp for ${email} : ${otp}`);
    res.status(200).json({
        message: "OTP generated and Logged"
    });
});
//Endoint to reset password 
app.post('/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        res.status(411).json({
            message: 'Email, otp and new password is required'
        });
    }
    if (otpStore[email] === otp) {
        console.log(`Password for ${email} has been reset to ${newPassword}`);
        delete otpStore[email];
        res.status(200).json({ message: "Password has been reset successfully" });
    }
    else {
        res.status(411).json({
            message: "Invalid otp"
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
