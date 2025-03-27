const express = require("express");
const { getReviews,addReview,createWorkers, getWorkers, getSingleWorkers, searchWorkers, updateWorkers,verifyWorker,deleteWorker,verifyForDelete,GiveDetails } = require("../controller/Workers.controller");
const upload = require("../middlewares/multer");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createWorkers);
router.route("/").get(isAuthenticated, getWorkers);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateWorkers);
router.route("/reviews/:id").post(addReview);
router.route("/verify-Worker").post(verifyWorker);
router.route("/verify-For-Delete").post(verifyForDelete);
router.route("/information").post(GiveDetails);
router.route("/delete-worker").post(deleteWorker);
router.route("/reviews/:id").get(getReviews);
router.route("/search/:searchText").get(isAuthenticated, searchWorkers);
router.route("/:id").get(isAuthenticated, getSingleWorkers);

module.exports = router;
