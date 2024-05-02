import  express from "express";

const app = express();
app.use(express.json());

const PORT = 3000;

const otpStore : Record<string,string> = {};

app.post('/generate',(req,res)=>{
    const email = req.body.email;
    if(!email){
        res.send(411).json({
            message : "Please enter a valid email"
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`otp for ${email} : ${otp}`);
    res.send(200).json({
        message : "OTP generated and Logged"
    })
})


app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`);
})

