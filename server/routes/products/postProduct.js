const router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { Product } = require("../../models/product");
const { Auction } = require("../../models/auction");
const { User } = require("../../models/user");
var ObjectId = require("mongoose").Types.ObjectId;
const { cloudinary } = require("./cloudinary");
require("dotenv").config();
const auctionsScheduler = require("../auctionSpace/auctionsScheduler");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.post("/", upload.single("productImage"), async (req, res) => {
  try {
    const sellerId = req.id;
    const startDateTime = req.body.startDateTime;
    const separatedStartDate = startDateTime.split("T");
    const startDate = separatedStartDate[0];
    const endDateTime = req.body.endDateTime;

    const result = await cloudinary.uploader.upload(req.file.path);
    const productImage = result.secure_url;

    const product = await new Product({
      ...req.body,
      productImage: productImage,
      seller: sellerId,
    }).save();

    const auction = await new Auction({
      product: product._id,
      productName: product.productName,
      startDateTime,
      startDate: startDate,
      endDateTime: endDateTime,
      basePrice: product.productBasePrice,
    }).save();

    auctionsScheduler.scheduleReminder(auction);
    auctionsScheduler.scheduleStart(auction);
    auctionsScheduler.scheduleEnd(auction);

    await User.findOneAndUpdate(
      { _id: ObjectId(sellerId) },
      { $push: { postedProducts: ObjectId(product._id) } }
    );

    res.status(200).json(product._id);
  } catch (error) {
    console.error("Error in posting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
