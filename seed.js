import "dotenv/config";
import { connectDB } from "./db.js";
import PageContent from "./models/PageContent.js";
import Admin from "./models/Admin.js";

const seedData = {
  home: {
    hero: {
      eyebrow: "Coimbatore \u00b7 Est. 2016 \u00b7 Strength & Performance",
      title: "Train with no wasted reps.",
      subtitle:
        "Forge Athletic is a strength and conditioning facility built for people who take their training seriously — real coaching, real equipment, measurable progress.",
      image: "https://picsum.photos/seed/forge-hero/1800/1400",
    },
    ctaImage: "https://picsum.photos/seed/forge-cta/1800/900",
    stats: [
      { label: "Active members", to: 1200, suffix: "+" },
      { label: "Training floor", to: 18000, suffix: " sqft" },
      { label: "Weekly classes", to: 42, suffix: "" },
      { label: "Certified coaches", to: 11, suffix: "" },
    ],
    features: [
      {
        title: "Programming, not guesswork",
        body: "Every block is periodized by our coaching staff — strength, conditioning, and recovery mapped to your training age.",
        img: "https://picsum.photos/seed/forge-program/900/1100",
      },
      {
        title: "Equipment that holds up",
        body: "Competition platforms, calibrated plates, and machines serviced monthly. Nothing here is decorative.",
        img: "https://picsum.photos/seed/forge-equipment/900/1100",
      },
      {
        title: "Coaches on the floor",
        body: "Not just at check-in. Our trainers cue lifts, correct form, and track your numbers session to session.",
        img: "https://picsum.photos/seed/forge-coach/900/1100",
      },
    ],
    programs: [
      { code: "STR", name: "Strength", desc: "Barbell-based programming built around the big lifts.", img: "https://picsum.photos/seed/forge-strength/800/1000" },
      { code: "CON", name: "Conditioning", desc: "Engine work that scales from beginner to competitor.", img: "https://picsum.photos/seed/forge-conditioning/800/1000" },
      { code: "MOB", name: "Mobility & Recovery", desc: "Guided sessions to keep you training pain-free.", img: "https://picsum.photos/seed/forge-mobility/800/1000" },
    ],
  },

  about: {
    hero: {
      eyebrow: "About Forge",
      title: "A gym built by lifters, for lifters.",
      subtitle:
        "Forge Athletic started because our founders couldn't find a gym in Coimbatore that took strength training seriously without turning it into a spectacle. A decade later, the mission hasn't changed: give people the space, equipment, and coaching to get measurably stronger.",
      image: "",
    },
    missionTitle: "Make serious training accessible without lowering the standard",
    missionBody:
      "We believe strength training is for everyone — students, working professionals, competitive athletes — but the coaching and equipment shouldn't be watered down to get there. Every member gets an intake assessment, a program suited to their goals, and a coach who actually knows their name and their numbers.",
    missionImage: "https://picsum.photos/seed/forge-mission/900/1100",
    closingImage: "https://picsum.photos/seed/forge-founders/1800/900",
    values: [
      { title: "Evidence over hype", body: "Programming is grounded in what the research and the log book actually show works." },
      { title: "Coaching first", body: "A gym is only as good as the eyes watching your bar path. We hire for that first." },
      { title: "Every level welcome", body: "First deadlift or fifteenth year training — the standard for effort is the same, the load isn't." },
      { title: "Long game", body: "We measure success in years of consistent training, not a single before-and-after photo." },
    ],
    timeline: [
      { year: "2016", text: "Forge opens as a single-room barbell club in Peelamedu with 12 founding members.", img: "https://picsum.photos/seed/forge-2016/500/500" },
      { year: "2019", text: "Expanded into the current 18,000 sqft facility; added conditioning and turf zones.", img: "https://picsum.photos/seed/forge-2019/500/500" },
      { year: "2022", text: "Built out the Recovery Lab and brought coaching staff to eleven full-time trainers.", img: "https://picsum.photos/seed/forge-2022/500/500" },
      { year: "2026", text: "Crossed 1,200 active members while keeping class sizes capped for real coaching.", img: "https://picsum.photos/seed/forge-2026/500/500" },
    ],
  },

  infrastructure: {
    hero: {
      eyebrow: "Infrastructure",
      title: "18,000 sqft, zoned for every kind of training.",
      subtitle: "",
      image: "https://picsum.photos/seed/forge-floorplan/1800/1200",
    },
    facilities: [
      { code: "01", name: "Strength Zone", sqft: "4,200", detail: "8 competition platforms, calibrated bars and plates, squat racks and specialty bars.", img: "https://picsum.photos/seed/forge-strengthzone/900/700" },
      { code: "02", name: "Cardio Deck", sqft: "2,600", detail: "Rowers, assault bikes, ski ergs and treadmills with a heart-rate display wall.", img: "https://picsum.photos/seed/forge-cardiodeck/900/700" },
      { code: "03", name: "Functional Turf", sqft: "3,000", detail: "Sled tracks, battle ropes, and open turf for conditioning circuits.", img: "https://picsum.photos/seed/forge-turf/900/700" },
      { code: "04", name: "Recovery Lab", sqft: "1,800", detail: "Mobility floor, foam rolling stations, sauna and cold plunge.", img: "https://picsum.photos/seed/forge-recovery/900/700" },
      { code: "05", name: "Boxing Ring", sqft: "1,200", detail: "Full-size ring, heavy bags, and pad work space for combat conditioning.", img: "https://picsum.photos/seed/forge-boxing/900/700" },
      { code: "06", name: "Locker & Lounge", sqft: "2,400", detail: "Private showers, secure lockers, and a members' lounge with fuel bar.", img: "https://picsum.photos/seed/forge-lounge/900/700" },
    ],
    trainers: [
      { name: "Arjun Menon", role: "Head Strength Coach", cert: "CSCS \u00b7 12 yrs", spec: "Powerlifting & barbell mechanics", img: "https://picsum.photos/seed/forge-arjun/700/900" },
      { name: "Divya Ramaswamy", role: "Conditioning Coach", cert: "ACE-CPT \u00b7 8 yrs", spec: "Metabolic conditioning", img: "https://picsum.photos/seed/forge-divya/700/900" },
      { name: "Karthik Suresh", role: "Mobility & Recovery Lead", cert: "FRC \u00b7 6 yrs", spec: "Joint mobility, injury return", img: "https://picsum.photos/seed/forge-karthik/700/900" },
      { name: "Priya Natarajan", role: "Performance Coach", cert: "NSCA-CPT \u00b7 9 yrs", spec: "Athletic performance, sprint work", img: "https://picsum.photos/seed/forge-priya/700/900" },
      { name: "Rahul Varadhan", role: "Boxing Coach", cert: "USA Boxing \u00b7 10 yrs", spec: "Combat conditioning, pad work", img: "https://picsum.photos/seed/forge-rahul/700/900" },
      { name: "Sneha Iyer", role: "Nutrition & Wellness Coach", cert: "PN1 \u00b7 5 yrs", spec: "Contest prep, body recomposition", img: "https://picsum.photos/seed/forge-sneha/700/900" },
    ],
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Come see the floor.",
      subtitle: "",
      image: "https://picsum.photos/seed/forge-contact/1800/1000",
    },
    contactInfo: {
      address: "14 Race Course Road, Coimbatore, Tamil Nadu 641018",
      phone: "+91 98765 43210",
      email: "train@forgeathletic.in",
      mapImage: "https://picsum.photos/seed/forge-map/900/600",
    },
    hours: [
      { day: "Monday \u2013 Friday", time: "05:00 \u2013 22:00" },
      { day: "Saturday", time: "06:00 \u2013 20:00" },
      { day: "Sunday", time: "07:00 \u2013 14:00" },
    ],
  },
};

async function run() {
  await connectDB();

  for (const [page, data] of Object.entries(seedData)) {
    await PageContent.findOneAndUpdate({ page }, { page, ...data }, { upsert: true, new: true });
    console.log(`Seeded "${page}"`);
  }

  // Ensure an admin user exists in the DB (from .env). This allows auth to
  // validate against the DB record in production.
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (adminUsername && adminHash) {
    await Admin.findOneAndUpdate(
      { username: adminUsername },
      { username: adminUsername, passwordHash: adminHash },
      { upsert: true, new: true }
    );
    console.log(`Seeded admin user "${adminUsername}"`);
  } else {
    console.warn("ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set; skipping admin seed.");
  }

  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});