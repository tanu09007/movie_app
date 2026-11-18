const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const OTPs = require("../models/otp");
const UserDetail = require("../models/UserDetail");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client =
  accountSid && authToken ? twilio(accountSid, authToken) : null;

// Login rsignup
router.post("/signup", async (req, res) => {
  const { mobileNumber } = req.body;

  // Check if mobileNumber is provided
  if (!mobileNumber) {
    return res.status(400).json({ error: "Mobile number is required" });
  }

  if (!client || !fromPhoneNumber) {
    return res.status(503).json({ error: "SMS provider is not configured" });
  }

  try {
    // Generate OTP (random 6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via Twilio SMS
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: fromPhoneNumber,
      to: mobileNumber,
    });

    // You can optionally store the OTP in a database or session for verification

    await OTPs.create({
      mobileNumber,
      otp,
    });
    console.log(otp, "otp");
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//login

router.post("/login", async (req, res) => {
  const { mobileNumber, otp } = req.body;

  // Check if mobileNumber and otp are provided
  if (!mobileNumber || !otp) {
    return res
      .status(400)
      .json({ error: "Mobile number and OTP are required" });
  }

  try {
    // Find the OTP entry in the database
    const otpEntry = await OTPs.findOne({ where: { mobileNumber, otp } });

    // Check if OTP entry exists and is not expired
    if (
      otpEntry &&
      otpEntry.createdAt.getTime() + 5 * 60 * 1000 >= Date.now()
    ) {
      // OTP is verified
      // Return success response along with the mobile number
      return res.status(200).json({
        message: "OTP verified successfully",
        mobileNumber: mobileNumber,
      });
    } else {
      return res.status(401).json({ error: "Invalid OTP or OTP expired" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/// user detail

// Create a user detail
router.post("/user-details", async (req, res) => {
  try {
    const userDetail = await UserDetail.create(req.body);
    return res.status(201).json(userDetail);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all user details
router.get("/user-details", async (req, res) => {
  try {
    const userDetails = await UserDetail.findAll();
    return res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get user detail by mobile number
router.get("/user-details/:mobileNumber", async (req, res) => {
  const { mobileNumber } = req.params;
  try {
    const userDetail = await UserDetail.findOne({ where: { mobileNumber } });
    if (!userDetail) {
      return res.status(404).json({ error: "User detail not found" });
    }
    return res.status(200).json(userDetail);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update user detail by mobile number
router.put("/user-details/:mobileNumber", async (req, res) => {
  const { mobileNumber } = req.params;
  try {
    const [updatedRowsCount] = await UserDetail.update(req.body, {
      where: { mobileNumber },
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "User detail not found" });
    }
    return res
      .status(200)
      .json({ message: "User detail updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user detail by mobile number
router.delete("/user-details/:mobileNumber", async (req, res) => {
  const { mobileNumber } = req.params;
  try {
    const deletedRowCount = await UserDetail.destroy({
      where: { mobileNumber },
    });
    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "User detail not found" });
    }
    return res
      .status(200)
      .json({ message: "User detail deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
