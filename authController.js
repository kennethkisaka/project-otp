const bcrypt = require('bcrypt'); //Used to securely compare hashed passwords.
const jwt = require('jsonwebtoken'); //Used to create authentication tokens for secure communication.
const nodemailer = require('nodemailer'); //Used to send emails (e.g., OTP to users).
const User = require('./userModel'); //Represents a MongoDB schema (assumed to have fields like email, password, otp, and otpExpiresAt).
const mongoose = require('mongoose');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Explicitly use Gmail
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App Password, NOT your regular password
  },
});

//TODO: add the following functionality,
// If the user attempts to enter the password five times incorrectly, do not listen for the users attempts till three minutes are over, keep multiply the time by two
// for every other wrong attempt
// also if a user at any time enters a  wrong password, delay accepting that users attempt by 10 second.
// optional: if the user fails to enter the correct OTP after more than three attempts send another OTP to the user and make sure they enter it with less that three attempts or else block the user temporalily for 24hrs
// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`this is user email ${email}, this is password ${password}`)
  
  try {
    const user = await User.findOne({ email });
    // Create a model with a custom collection name
    // const User = mongoose.model('User', userSchema, 'users'); // Collection name is explicitly set to 'users'

    // // Use the model as usual
    // User.find({ email: 'kennethkisaka1@gmail.com' })
    //   .then(users => console.log(users))
    //   .catch(err => console.error(err));

    console.log("user: ", user)
    console.log("pass1")
    if (!user) return res.status(404).send('User not found');
    console.log("pass2")

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("pass3")
    const saltRounds = 10; // Number of hashing rounds (adjust for more security, but slower computation)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword)
    if (!isPasswordValid) return res.status(401).send('Invalid credentials');
    console.log("pass4")

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 2 * 60 * 1000; // OTP valid for 1 min
    await user.save();

    // Send OTP via email
    await transporter.sendMail({
      from: "maky254001@gmail.com",
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });

    res.status(200).send({ "message": 'OTP sent to your email', "userid": user._id });
  } catch (error) {
    console.error("login error:", error)
    res.status(500).send('Server error');
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    // const user = await User.findById(userId);
    const user = await User.findOne({  });
    console.log("user::", user)
    console.log("this is userid: ", user)
    if (!user || user.otp !== otp || Date.now() > user.otpExpiresAt)
      return res.status(401).send('Invalid or expired OTP');

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Clear OTP from database
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
