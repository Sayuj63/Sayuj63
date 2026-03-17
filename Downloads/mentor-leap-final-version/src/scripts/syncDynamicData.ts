import { db, admin } from "../lib/firebaseAdmin";

async function syncDynamicData() {
  console.log("--- Starting Dynamic Data Sync ---");

  // 1. COURSES (Only Speak with Impact Bootcamp)
  console.log("Syncing Courses...");
  // Clear old courses
  const coursesSnapshot = await db.collection("courses").get();
  for (const doc of coursesSnapshot.docs) await doc.ref.delete();

  const bootcampCourseId = "speak-with-impact-bootcamp";
  await db.collection("courses").doc(bootcampCourseId).set({
    title: "Speak with Impact Bootcamp",
    description: "A two-day immersive learning experience designed to help professionals develop confident communication and structured thinking for the modern workplace. Participants will learn practical frameworks to communicate ideas clearly and influence professional conversations.",
    date: "March 28–29, 2026",
    time: "7-9 PM IST on both days",
    price: 7999,
    highlights: [
      "How to structure ideas clearly in meetings and presentations",
      "How to communicate with confidence and authority",
      "Techniques to get over stage fright & performance anxiety",
      "How to influence stakeholder discussions and speak with impact",
      "The Communicator’s Compass for confident conversations",
      "Body language secrets for enhanced executive presence",
      "Mridu’s Toolkit for Communication Victory at the workplace"
    ],
    instructor: "Mridu Bhandari",
    updatedAt: new Date()
  }, { merge: true });

  // 2. EVENTS (Specific Cleanup & Seeding)
  console.log("Syncing Events...");
  const eventSnapshot = await db.collection("events").get();
  for (const doc of eventSnapshot.docs) {
    if (!["speak-with-impact-bootcamp"].includes(doc.id)) {
      await doc.ref.delete();
    }
  }

  const bootcampId = "speak-with-impact-bootcamp";
  await db.collection("events").doc(bootcampId).set({
    title: "Speak with Impact Bootcamp",
    description: "A two-day immersive learning experience designed to help professionals develop confident communication and structured thinking for the modern workplace. Participants will learn practical frameworks to communicate ideas clearly and influence professional conversations.",
    price: 7999,
    date: "March 28–29, 2026",
    time: "7-9 PM IST on both days",
    speaker: "Mridu Bhandari",
    seats: 50,
    highlights: [
      "How to structure ideas clearly in meetings and presentations",
      "How to communicate with confidence and authority",
      "Techniques to get over stage fright & performance anxiety",
      "How to influence stakeholder discussions and speak with impact",
      "The Communicator’s Compass for confident conversations",
      "Body language secrets for enhanced executive presence",
      "Mridu’s Toolkit for Communication Victory at the workplace"
    ],
    offer: "10 participants will receive FREE access to the Bootcamp. The next 50 participants will receive 50 percent discount on the Bootcamp fee.",
    category: "Communication",
    thumbnail: "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?w=800&q=80",
    banner: "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?w=800&q=80",
    updatedAt: new Date()
  }, { merge: true });

  // 3. FAQS
  console.log("Syncing FAQs...");
  const faqs = [
    {
      q: "Who is MentorLeap designed for?",
      a: "MentorLeap is designed for professionals, managers, entrepreneurs and university students who want to develop stronger public speaking, communication and leadership skills."
    },
    {
      q: "Will MISHA AI support learners during courses?",
      a: "Yes. MISHA will assist learners throughout their learning journey by providing research support, interview/presentation preparation guidance and structured learning assistance."
    },
    {
      q: "What is the format of the Speak with Impact Bootcamp?",
      a: "The Speak with Impact Bootcamp is a two-day transformational learning program designed to help professionals communicate with confidence and clarity at the workplace. It is highly interactive, live and offers practical frameworks that can be applied immediately."
    }
  ];
  
  // Clear old FAQs
  const faqSnapshot = await db.collection("faqs").get();
  for (const doc of faqSnapshot.docs) await doc.ref.delete();
  
  for (const faq of faqs) {
    await db.collection("faqs").add({ ...faq, updatedAt: new Date() });
  }

  // 4. TESTIMONIALS (Reviews)
  console.log("Syncing Reviews...");
  const reviews = [
    {
      name: "Senior Consultant",
      location: "Global Consulting Firm",
      text: "MentorLeap helped me structure my thinking and communicate my ideas much more effectively in meetings and presentations.",
      stars: 5
    }
  ];

  // Clear old reviews
  const reviewSnapshot = await db.collection("reviews").get();
  for (const doc of reviewSnapshot.docs) await doc.ref.delete();

  for (const rev of reviews) {
    await db.collection("reviews").add({ ...rev, updatedAt: new Date() });
  }

  console.log("--- Sync Complete ---");
}

syncDynamicData().catch(console.error);
