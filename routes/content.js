import { Router } from "express";
import PageContent from "../models/PageContent.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const PAGES = ["home", "about", "infrastructure", "contact"];

// Section names that are arrays — these support add/edit/delete of a single item.
const ARRAY_SECTIONS = [
  "stats",
  "features",
  "programs",
  "values",
  "timeline",
  "facilities",
  "galleryGroups",
  "trainers",
  "hours",
  "whyChooseUs",
];

// Top-level scalar/object fields — these are updated wholesale via PUT /:page.
const SCALAR_FIELDS = [
  "hero",
  "marquee",
  "secondaryMarquee",
  "aboutSection",
  "ctaImage",
  "missionTitle",
  "missionBody",
  "missionImage",
  "closingImage",
  "contactInfo",
];

function assertValidPage(req, res, next) {
  if (!PAGES.includes(req.params.page)) {
    return res.status(404).json({ error: "Unknown page" });
  }
  next();
}

function assertValidSection(req, res, next) {
  if (!ARRAY_SECTIONS.includes(req.params.section)) {
    return res.status(404).json({ error: "Unknown section" });
  }
  next();
}

async function getOrCreate(page) {
  let doc = await PageContent.findOne({ page });
  if (!doc) doc = await PageContent.create({ page });
  return doc;
}

// ---- Public reads ----

router.get("/", async (req, res) => {
  const docs = await PageContent.find({ page: { $in: PAGES } });
  res.json(docs);
});

router.get("/:page", assertValidPage, async (req, res) => {
  const doc = await getOrCreate(req.params.page);
  res.json(doc);
});

// ---- Admin: update scalar/object fields (hero, contactInfo, mission copy...) ----

router.put("/:page", assertValidPage, requireAdmin, async (req, res) => {
  const updates = {};
  for (const key of SCALAR_FIELDS) {
    if (key in req.body) updates[key] = req.body[key];
  }

  const doc = await PageContent.findOneAndUpdate(
  { page: req.params.page },
  { $set: updates },
  { returnDocument: "after", upsert: true }
);
  res.json(doc);
});

// ---- Admin: add an item to an array section ----

router.post("/:page/:section", assertValidPage, assertValidSection, requireAdmin, async (req, res) => {
  const doc = await getOrCreate(req.params.page);
  doc[req.params.section].push(req.body);
  await doc.save();
  res.status(201).json(doc);
});

// ---- Admin: update one item in an array section ----

router.put("/:page/:section/:itemId", assertValidPage, assertValidSection, requireAdmin, async (req, res) => {
  const doc = await getOrCreate(req.params.page);
  const item = doc[req.params.section].id(req.params.itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });

  Object.assign(item, req.body);
  await doc.save();
  res.json(doc);
});

// ---- Admin: delete one item from an array section ----

router.delete("/:page/:section/:itemId", assertValidPage, assertValidSection, requireAdmin, async (req, res) => {
  const doc = await getOrCreate(req.params.page);
  doc[req.params.section].id(req.params.itemId)?.deleteOne();
  await doc.save();
  res.json(doc);
});

export default router;