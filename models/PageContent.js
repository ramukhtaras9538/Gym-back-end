import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * One document per page ("home" | "about" | "infrastructure" | "contact").
 * Every array section below has its own _id per item (Mongoose default),
 * which is what the admin panel uses to edit/delete a single row without
 * touching the rest of the array.
 *
 * Not every page uses every field — Home uses hero/stats/features/programs,
 * About uses hero/values/timeline, Infrastructure uses hero/facilities/trainers,
 * Contact uses hero/contactInfo/hours. Unused fields just stay empty arrays.
 */
const heroSchema = new Schema(
  {
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const pageContentSchema = new Schema(
  {
    page: {
      type: String,
      enum: ["home", "about", "infrastructure", "contact"],
      required: true,
      unique: true,
    },
    hero: { type: heroSchema, default: () => ({}) },
    marquee: { type: String, default: "" },
    secondaryMarquee: { type: String, default: "" },

    // Home
    aboutSection: {
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "" },
      body: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    stats: [
      {
        label: String,
        to: Number,
        suffix: String,
      },
    ],
    features: [
      {
        title: String,
        body: String,
        img: String,
      },
    ],
    programs: [
      {
        code: String,
        name: String,
        desc: String,
        img: String,
      },
    ],
    ctaImage: { type: String, default: "" },

    // About
    missionTitle: { type: String, default: "" },
    missionBody: { type: String, default: "" },
    missionImage: { type: String, default: "" },
    values: [
      {
        title: String,
        body: String,
      },
    ],
    timeline: [
      {
        year: String,
        text: String,
        img: String,
      },
    ],
    closingImage: { type: String, default: "" },

    // Infrastructure
    facilities: [
      {
        code: String,
        name: String,
        sqft: String,
        detail: String,
        img: String,
      },
    ],
    galleryGroups: [
      {
        title: String,
        subtitle: String,
        images: [String],
      },
    ],
    trainers: [
      {
        name: String,
        role: String,
        cert: String,
        spec: String,
        img: String,
      },
    ],

    // Contact
    contactInfo: {
      address: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      website: { type: String, default: "" },
      mapImage: { type: String, default: "" },
    },
    hours: [
      {
        day: String,
        time: String,
      },
    ],
    whyChooseUs: [
      {
        title: String,
        body: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PageContent", pageContentSchema);