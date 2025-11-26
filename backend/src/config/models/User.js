import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: String,
    description: String,
    tags: [String]
  },
  { _id: true, timestamps: true }
);

const SocialLinksSchema = new mongoose.Schema(
  {
    twitter: String,
    instagram: String,
    discord: String,
    other: String
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["artist", "buyer"],
      required: true
    },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    displayName: String,
    passwordHash: { type: String, required: true },

    bio: { type: String, default: "" },
    avatarUrl: String,
    bannerUrl: String,

    artStyles: [String], // e.g. ["nsfw", "furry"]
    priceMin: Number,
    priceMax: Number,

    slides: [SlideSchema], // used by Quick Commissions

    socialLinks: SocialLinksSchema
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
