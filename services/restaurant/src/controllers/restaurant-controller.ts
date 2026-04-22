import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import Restaurant from "../models/restaurent.js";
import jwt from "jsonwebtoken";

export const addRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorised",
      });
    }
    const existsingRestaurant = await Restaurant.findOne({
      ownerId: user?._id,
    });

    if (existsingRestaurant) {
      return res.status(400).json({
        message: "You already have a restaurent",
      });
    }

    const { name, description, latitude, longitude, formattedAddress, phone } =
      req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({
        message: "Please provide all details",
      });
    }
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Please provide image",
      });
    }
    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
      return res.status(500).json({ message: "Failed to create file buffer" });
    }

    const { data: uploadResult } = await axios.post(
      `${process.env.UTILS_SERVICE}/api/upload`,
      { buffer: fileBuffer.content },
    );

    const restaurent = await Restaurant.create({
      name,
      description,
      phone,
      image: uploadResult.url,
      ownerId: user._id,
      autoLocation: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
        formattedAddress,
      },
      isVerified: false,
    });

    return res.status(201).json({
      message: "Restaurant created successfully",
      restaurent,
    });
  },
);

export const fetchMyRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Please Login",
      });
    }

    const restaurant = await Restaurant.findOne({
      ownerId: req.user._id.toString(),
    });

    if (!restaurant) {
      return res.status(400).json({
        message: "Restaurant not found",
      });
    }
    if (!req.user.restaurantId) {
      const token = jwt.sign(
        {
          user: {
            ...req.user,
            restaurantId: restaurant._id,
          },
        },
        process.env.JWT_SEC as string,
        { expiresIn: "15d" },
      );

      return res.json({ restaurant, token });
    }
    return res.json({ restaurant });
  },
);
