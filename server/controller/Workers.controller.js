const Workers = require("../models/Workers.model"); // ✅ Correct
const uploadImageOnCloudinary = require("../utils/imageUpload");
// const { User } = require("../models/user.model");
const mongoose = require("mongoose");
const { generateOTP, sendOTP } = require("../utils/twilio");
// Create Workers
exports.createWorkers = async (req, res) => {
    try {
        const { WorkersName, city, country, contactNo, Occupations } = req.body;
        const file = req.file;

        // Check if Workers already exists for the user
        // const existingWorkers = await Workers.findOne({ user: req.id });
        // if (existingWorkers) {
        //     return res.status(400).json({ success: false, message: "Workers already exists for this user" });
        // }

        // Validate image file
        if (!file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Upload image to Cloudinary
        const imageUrl = await uploadImageOnCloudinary(file);

        // Create new Workers
        const newWorkers = await Workers.create({
            user: req.id,
            WorkersName,
            city,
            country,
            contactNo,
            Occupations: JSON.parse(Occupations),
            imageUrl,
        });

        return res.status(201).json({ success: true, message: "Workers Added", Workers: newWorkers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Workers
exports.getWorkers = async (req, res) => {
    try {
        const workers = await Workers.findOne({ user: req.id }).populate("explores");
        if (!workers) {
            return res.status(404).json({ success: false, workers: [], message: "Workers not found" });
        }

        return res.status(200).json({ success: true, workers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const TempWorker = require("../models/TempWorker");

exports.updateWorkers = async (req, res) => {
    try {
        const { WorkersName, city, country, contactNo, Occupations,workerId } = req.body;
        const file = req.file;
        const user = req.id;

        // Find Worker by user ID
        const workers = await Workers.findById(workerId); // ✅ Correct
        if (!workers) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }

        // ✅ Generate OTP and send via Twilio
        const otp = generateOTP();
        const phoneNumber = String(contactNo).trim();
        const result = await sendOTP(phoneNumber, otp);
        if (!result.success) {
            return res.status(500).json({ success: false, message: "Failed to send OTP" });
        }

        // ✅ Prepare image URL if a new file is uploaded
        let imageUrl = workers.imageUrl; // Keep old image if not updated
        if (file) {
            imageUrl = await uploadImageOnCloudinary(file);
        }

        // ✅ Store updated worker data in TempWorker with `workers._id`
        await TempWorker.findOneAndUpdate(
            { _id: workers._id }, // ✅ Store `Workers._id` instead of `user`
            {
                WorkersName,
                city,
                country,
                contactNo,
                Occupations: JSON.parse(Occupations),
                imageUrl,
                verificationToken: otp,
                verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 min expiry
            },
            { upsert: true, new: true }
        );
        return res.status(200).json({
            success: true,
            message: "OTP sent. Please verify to update your profile.",
            workerId: workers._id // ✅ Send workerId in response
        });
    } catch (error) {
        console.log("Update Workers Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const TempDeleteWorker = require("../models/TempDeleteWorker");
exports.deleteWorker = async (req, res) => {
    try {
        const { WorkersId } = req.body;

        // Find Worker by user ID
        const workers = await Workers.findById(WorkersId);
        if (!workers) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }

        // ✅ Generate OTP and send via Twilio
        const otp = generateOTP();
        const phoneNumber = workers.contactNo;
        // const result = await sendOTP(phoneNumber, otp);
        const result={success:true}
        const verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Step 1: Delete any existing document with the same `id`
        await TempDeleteWorker.deleteMany({ id: WorkersId });

        // Step 2: Create a new document
        const findDelete = await TempDeleteWorker.create({
            id: WorkersId,
            verificationToken: otp,
            verificationTokenExpiresAt: verificationTokenExpiresAt
        });


        if (!result.success) {
            return res.status(500).json({ success: false, message: "Failed to send OTP" });
        }

        // ✅ Prepare image URL if a new file is uploaded

        // ✅ Store updated worker data in TempWorker with `workers._id`
        return res.status(200).json({
            success: true,
            message: "OTP sent. Please verify to update your profile.",
            workerId: workers._id // ✅ Send workerId in response
        });
    } catch (error) {
        console.log("Update Workers Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};




exports.verifyForDelete = async (req, res) => {
    try {
        const { verificationCode, workerId } = req.body;
        const user = workerId; // Get user ID

        if (!verificationCode) {
            return res.status(400).json({ success: false, message: "Verification code is required." });
        }

        // ✅ Find TempWorker entry for the user
        const query = {
            id: user, // Ensure it's a string
            verificationTokenExpiresAt: { $gt: new Date() } // Ensure Date comparison works
        };


        const tempDeleteWorker = await TempDeleteWorker.findOne(query);


        if (!tempDeleteWorker || verificationCode !== tempDeleteWorker.verificationToken) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        // ✅ Find Worker profile
        const workers = await Workers.findOne({
            _id: new mongoose.Types.ObjectId(user)  // ✅ Convert user (string) to ObjectId
        });

        if (!workers) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }


        // ✅ Delete Worker profile
        const deleteQuery = { _id: new mongoose.Types.ObjectId(user) }; // Use _id for deletion

        const deleteResult = await Workers.deleteOne(deleteQuery);

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Worker not found or already deleted." });
        }

        // ✅ Delete TempWorker entry
        await TempDeleteWorker.deleteOne({ id: user });

        return res.status(200).json({ success: true, message: "Worker details updated successfully!" });

    } catch (error) {
        console.log("Verify Worker Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.verifyWorker = async (req, res) => {
    try {
        const { verificationCode, workerId } = req.body;
        const user = workerId // Get user ID

        if (!verificationCode) {
            return res.status(400).json({ success: false, message: "Verification code is required." });
        }

        // ✅ Find TempWorker entry for the user
        const tempWorker = await TempWorker.findOne({
            _id: new mongoose.Types.ObjectId(user),  // ✅ Convert user (string) to ObjectId
            verificationTokenExpiresAt: { $gt: Date.now() } // ✅ Ensure OTP is valid
        });
        if (!tempWorker || verificationCode !== tempWorker.verificationToken) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        // ✅ Find Worker profile
        const workers = await Workers.findOne({
            _id: new mongoose.Types.ObjectId(user)  // ✅ Convert user (string) to ObjectId
        });

        if (!workers) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }

        // ✅ Move verified data from TempWorker to Workers
        workers.WorkersName = tempWorker.WorkersName;
        workers.city = tempWorker.city;
        workers.country = tempWorker.country;
        workers.contactNo = tempWorker.contactNo;
        workers.Occupations = tempWorker.Occupations;
        workers.imageUrl = tempWorker.imageUrl;

        // ✅ Save updated Worker profile
        await workers.save();

        // ✅ Delete TempWorker entry
        await TempWorker.deleteOne({ user });

        return res.status(200).json({ success: true, message: "Worker details updated successfully!", Workers: workers });

    } catch (error) {
        console.log("Verify Worker Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



// Add Review


exports.addReview = async (req, res) => {
    try {
        const { id } = req.params; // Workers ID
        let { userId, fullname, rating, comment } = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Convert userId to ObjectId
        userId = new mongoose.Types.ObjectId(userId);

        // Find the Workers
        const workers = await Workers.findById(id);
        if (!workers) {
            return res.status(404).json({ success: false, message: "Workers not found" });
        }

        // Remove the previous review from the same user before adding a new one
        workers.reviews = workers.reviews.filter((rev) => rev.userId.toString() !== userId.toString());

        // Add new review
        workers.reviews.push({ userId, fullname, rating, comment });
        const Reviewslength = workers.reviews.length
        // Calculate the total sum of ratings
        const totalRating = workers.reviews.reduce((sum, review) => sum + review.rating, 0);

        // Calculate the average rating
        const averageRating = totalRating / workers.reviews.length;

        // Update the rating field in the Workers document
        workers.rating = averageRating;

        // Save the Workers with the updated reviews and rating
        await workers.save({ validateBeforeSave: false });

        return res.status(201).json({
            success: true,
            message: "Review added/updated",
            review: workers.reviews,
            Reviewslength,
            averageRating: workers.rating, // Return the updated average rating
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all reviews for a Workers

exports.GiveDetails = async (req, res) => {
    try {
        const { workerId } = req.body;
        if (!workerId) {
            return res.status(400).json({ success: false, message: "Worker ID is required" });
        }

        const workers = await Workers.findById(workerId);
        if (!workers) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }
        return res.status(200).json({ success: true, workers });
    } catch (error) {
        console.error("GiveDetails Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const workers = await Workers.findById(id).populate("reviews.userId");
        if (!workers) {
            return res.status(404).json({ success: false, message: "Workers not found" });
        }
        return res.status(200).json({ success: true, reviews: workers.reviews });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Search Workers
// exports.searchWorkers = async (req, res) => {
//     try {
//         const searchText = req.params.searchText || "";
//         const searchQuery = req.query.searchQuery || "";
//         const selectedOccupations = (req.query.selectedOccupations || "").split(",").filter((Occupation) => Occupation);
//         const query = {};

//         if (searchText) {
//             query.$or = [
//                 { WorkersName: { $regex: searchText, $options: "i" } },
//                 { city: { $regex: searchText, $options: "i" } },
//                 { country: { $regex: searchText, $options: "i" } },
//             ];
//         }

//         if (searchQuery) {
//             query.$or = [
//                 { WorkersName: { $regex: searchQuery, $options: "i" } },
//                 { Occupations: { $regex: searchQuery, $options: "i" } },
//             ];
//         }

//         if (selectedOccupations.length > 0) {
//             query.Occupations = { $in: selectedOccupations };
//         }
// if (selectedOccupations.length > 0) {
//     andConditions.push({
//       $or: selectedOccupations.map((occupation) => ({
//         Occupations: { $regex: `^${occupation.trim()}$`, $options: "i" }
//       })),
//     });
//   }

//         const workersList = await Workers.find(query);
//         console.log(workersList,searchText,searchQuery,selectedOccupations)
//         return res.status(200).json({ success: true, data: workersList });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


exports.searchWorkers = async (req, res) => {
    try {
      const searchText = req.params.searchText || "";
      const searchQuery = req.query.searchQuery || "";
      const selectedOccupations = (req.query.selectedOccupations || "")
        .split(",")
        .filter((occupation) => occupation);
  
      const andConditions = [];
  
      if (searchText) {
        andConditions.push({
          $or: [
            { WorkersName: { $regex: searchText, $options: "i" } },
            { city: { $regex: searchText, $options: "i" } },
            { country: { $regex: searchText, $options: "i" } },
          ],
        });
      }
  
      if (searchQuery) {
        andConditions.push({
          $or: [
            { WorkersName: { $regex: searchQuery, $options: "i" } },
            { Occupations: { $regex: searchQuery, $options: "i" } },
          ],
        });
      }
  
      if (selectedOccupations.length > 0) {
        andConditions.push({
          $or: selectedOccupations.map((occupation) => ({
            Occupations: {
              $elemMatch: {
                $regex: `^${occupation.trim()}\\s*$`,
                $options: "i",
              },
            },
          })),
        });
      }
  
      const finalQuery = andConditions.length > 0 ? { $and: andConditions } : {};
      const workersList = await Workers.find(finalQuery);
      console.log(finalQuery,workersList,selectedOccupations)
      
      return res.status(200).json({ success: true, workers: workersList });
    } catch (error) {
      console.error("Search Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

// Get Single Workers
exports.getSingleWorkers = async (req, res) => {
    try {
        const workersId = req.params.id;
        const workers = await Workers.findById(workersId).populate({
            path: "explores",
            options: { sort: { createdAt: -1 } },
        });

        if (!workers) {
            return res.status(404).json({ success: false, message: "Workers not found" });
        }

        return res.status(200).json({ success: true, Workers: workers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
