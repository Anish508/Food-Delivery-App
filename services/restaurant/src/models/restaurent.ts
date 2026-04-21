import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  description?: string;
  image: string;
  ownerId: string;
  phone: number;
  isVerified: boolean;

  autoLocation: {
    type: "Point";
    coordinates: [number, number]; //lan and lon
    formattedAddress: string;
  };

  isOpen: boolean;
  createdAt: Date;
}

const storeSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    image: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    autoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      formattedAddress: {
        type: String,
      },
    },
    isOpen: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

storeSchema.index({ autoLocation: "2dsphere" });

const Restaurant = mongoose.model<IRestaurant>("Restaurant");
export default Restaurant;
