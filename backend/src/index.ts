import  express from "express";
import rateLimit from 'express-rate-limit';
import cors from "cors";
const app = express();
app.use(express.json());

app.use(cors());
const SECRET_KEY = "your_site_secret";
const PORT = 3000;

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 password reset requests per windowMs
    message: 'Too many password reset attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
// Store OTPs in a simple in-memory object
const otpStore : Record<string,string> = {};

// Endpoint to generate and log OTP
app.post('/generate',otpLimiter,(req,res)=>{
    const email = req.body.email;
    if(!email){
        res.status(411).json({
            message : "Please enter a valid email"
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`otp for ${email} : ${otp}`);
    res.status(200).json({
        message : "OTP generated and Logged"
    })
});

//Endoint to reset password 
app.post('/reset-password',passwordResetLimiter,async(req,res)=>{
    const {email,otp,newPassword,token} = req.body;
    let formData = new FormData();
	formData.append('secret', SECRET_KEY);
	formData.append('response', token);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	const result = await fetch(url, {
		body: formData,
		method: 'POST',
	});
  const challengeSucceeded = (await result.json()).success;

  if (!challengeSucceeded) {
    return res.status(403).json({ message: "Invalid reCAPTCHA token" });
  }
    if(!email || !otp || !newPassword){
        res.status(411).json({
            message : 'Email, otp and new password is required'
        })
    }

    if (otpStore[email] === otp){
        console.log(`Password for ${email} has been reset to ${newPassword}`);
        delete otpStore[email];
        res.status(200).json({message : "Password has been reset successfully"});
    }else{
        res.status(411).json({
            message : "Invalid otp"
        })
    }
});

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`);
})

