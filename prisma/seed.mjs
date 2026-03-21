import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();

const prisma = new PrismaClient();

const SLUG = "shaffaith-shaukat-ali-2cpliq";

const COVER =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
const PROFILE =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80";

const OBITUARY = `It is with profound sorrow yet immense gratitude that we remember Shaffaith Shaukat Ali—a devoted parent, a steady friend, and a soul who believed that kindness was never wasted.

Born into a humble home and raised with faith and discipline, Shaffaith carried a quiet strength through every chapter of life. Colleagues knew him for his integrity; friends, for his warmth; and family, for a love that showed up in small, faithful ways—late-night conversations, handwritten notes, and laughter that could soften any room.

He found joy in simple rituals: morning tea before sunrise, tending the garden after rain, and sharing stories that turned strangers into kin. His faith guided his patience; his curiosity kept him young; his generosity left fingerprints on countless lives he never boasted about.

Shaffaith is survived by a circle of loved ones who will honor him by living gently, speaking honestly, and lifting others as he did—without fanfare, but with heart.

A celebration of his life will bring us together to give thanks for the years we were given with him. You are invited to light a candle, share a memory, and keep his spirit alive in the way you treat one another.`;

async function main() {
  const email =
    process.env.ADMIN_EMAIL ||
    process.env.DEMO_USER_EMAIL ||
    "demo@eternalmemory.local";
  const name =
    process.env.ADMIN_NAME || process.env.DEMO_USER_NAME || "Memorial Curator";

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  const memorial = await prisma.memorial.upsert({
    where: { slug: SLUG },
    create: {
      slug: SLUG,
      userId: user.id,
      firstName: "Shaffaith",
      lastName: "Shaukat Ali",
      dateOfBirth: new Date("1948-03-15T12:00:00.000Z"),
      dateOfDeath: new Date("2024-11-02T12:00:00.000Z"),
      obituary: OBITUARY,
      profileImage: PROFILE,
      coverImage: COVER,
      theme: "CLASSIC",
      isPublished: true,
      streamKey: "shaffaith-sanctuary",
      isStreaming: false,
    },
    update: {
      firstName: "Shaffaith",
      lastName: "Shaukat Ali",
      dateOfBirth: new Date("1948-03-15T12:00:00.000Z"),
      dateOfDeath: new Date("2024-11-02T12:00:00.000Z"),
      obituary: OBITUARY,
      profileImage: PROFILE,
      coverImage: COVER,
      isPublished: true,
      streamKey: "shaffaith-sanctuary",
      isStreaming: false,
      userId: user.id,
    },
  });

  const mid = memorial.id;

  await prisma.rSVP.deleteMany({ where: { memorialId: mid } });
  await prisma.checkIn.deleteMany({ where: { memorialId: mid } });
  await prisma.tribute.deleteMany({ where: { memorialId: mid } });
  await prisma.media.deleteMany({ where: { memorialId: mid } });
  await prisma.programItem.deleteMany({ where: { memorialId: mid } });
  await prisma.event.deleteMany({ where: { memorialId: mid } });

  const events = await prisma.$transaction([
    prisma.event.create({
      data: {
        memorialId: mid,
        title: "Visitation & viewing",
        type: "Visitation",
        startDate: new Date("2026-03-28T16:00:00.000Z"),
        location: "Grace Memorial Chapel — 120 River Road, Springfield",
      },
    }),
    prisma.event.create({
      data: {
        memorialId: mid,
        title: "Funeral service",
        type: "Service",
        startDate: new Date("2026-03-29T14:00:00.000Z"),
        location: "Grace Memorial Chapel — Main sanctuary",
      },
    }),
    prisma.event.create({
      data: {
        memorialId: mid,
        title: "Reception & stories",
        type: "Reception",
        startDate: new Date("2026-03-29T16:30:00.000Z"),
        location: "Community Hall — 88 Oak Lane",
      },
    }),
  ]);

  await prisma.programItem.createMany({
    data: [
      {
        memorialId: mid,
        title: "Prelude & seating",
        type: "OTHER",
        time: "1:45 PM",
        order: 1,
        description: "Instrumental reflection as guests gather.",
      },
      {
        memorialId: mid,
        title: "Opening prayer",
        type: "PRAYER",
        time: "2:00 PM",
        order: 2,
        speakerName: "Rev. James Okonkwo",
        description: "Invocation and words of comfort for the family.",
      },
      {
        memorialId: mid,
        title: "Psalm 23",
        type: "READING",
        time: "2:10 PM",
        order: 3,
        speakerName: "Amina Rahman",
      },
      {
        memorialId: mid,
        title: "How Great Thou Art",
        type: "SONG",
        time: "2:18 PM",
        order: 4,
        description: "Congregational hymn — lyrics in the service leaflet.",
      },
      {
        memorialId: mid,
        title: "Eulogy — A life of quiet courage",
        type: "EULOGY",
        time: "2:28 PM",
        order: 5,
        speakerName: "David Shaukat Ali",
        description:
          "Remembrances from Shaffaith’s eldest son, with gratitude and humor.",
      },
      {
        memorialId: mid,
        title: "Closing blessing",
        type: "PRAYER",
        time: "2:55 PM",
        order: 6,
        speakerName: "Rev. James Okonkwo",
      },
    ],
  });

  await prisma.media.createMany({
    data: [
      {
        memorialId: mid,
        type: "PHOTO",
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
        caption: "Family gathering, summer reunion",
      },
      {
        memorialId: mid,
        type: "PHOTO",
        url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
        caption: "Grandchildren at the garden gate",
      },
      {
        memorialId: mid,
        type: "PHOTO",
        url: "https://images.unsplash.com/photo-1529154166925-67257aac7db7?auto=format&fit=crop&w=1200&q=80",
        caption: "Wedding day — a gentle smile that never faded",
      },
      {
        memorialId: mid,
        type: "PHOTO",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        caption: "Mountain trail — his favorite view",
      },
      {
        memorialId: mid,
        type: "PHOTO",
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        caption: "Tea at sunrise — a daily ritual",
      },
    ],
  });

  await prisma.tribute.createMany({
    data: [
      {
        memorialId: mid,
        authorName: "Sara M.",
        status: "APPROVED",
        content:
          "Uncle Shaffaith taught me that patience is a form of love. I still hear his calm voice when life feels loud. Rest in the peace you so richly earned.",
      },
      {
        memorialId: mid,
        authorName: "The Hassan family",
        status: "APPROVED",
        content:
          "We are holding your family in prayer. Shaffaith’s generosity at the community kitchen inspired us to volunteer together every winter.",
      },
      {
        memorialId: mid,
        authorName: "Dr. Elaine Porter",
        status: "APPROVED",
        content:
          "A gentleman in every sense. His humor in difficult moments made the clinic a kinder place for patients and staff alike.",
      },
      {
        memorialId: mid,
        authorName: "Yusuf K.",
        status: "APPROVED",
        content:
          "He gave me my first job reference and my first lesson in showing up on time—with grace. Thank you, sir.",
      },
      {
        memorialId: mid,
        authorName: "Neighbor on Cedar St.",
        status: "APPROVED",
        content:
          "The block will be quieter without his wave from the porch. We’ll miss the figs he shared every August.",
      },
      {
        memorialId: mid,
        authorName: "Pending guest",
        status: "PENDING",
        content:
          "(Example pending message for moderators — approve from the dashboard.)",
      },
    ],
  });

  const guestNames = [
    { name: "Rukhsar Ali", email: "rukhsar@example.com" },
    { name: "Omar Farouk", email: "omar.f@example.com" },
    { name: "Priya Nandakumar", email: null },
    { name: "Michael Chen", email: "mchen@example.com" },
    { name: "Fatima Noor", email: "fatima@example.com" },
    { name: "Greg & Lisa Holt", email: "holts@example.com" },
    { name: "Imam Tariq", email: null },
    { name: "Anna Petrov", email: "anna.p@example.com" },
  ];

  await prisma.checkIn.createMany({
    data: [
      ...guestNames.map((g) => ({
        memorialId: mid,
        name: g.name,
        email: g.email,
        entryType: "GUESTBOOK",
      })),
      ...Array.from({ length: 14 }, (_, i) => ({
        memorialId: mid,
        name: "A visitor",
        email: null,
        entryType: "CANDLE",
      })),
    ],
  });

  await prisma.rSVP.createMany({
    data: [
      {
        memorialId: mid,
        eventId: events[0].id,
        name: "Leila Osman",
        email: "leila@example.com",
        status: "ATTENDING",
        guestCount: 2,
      },
      {
        memorialId: mid,
        eventId: events[1].id,
        name: "Thomas Wright",
        email: "twright@example.com",
        status: "ATTENDING",
        guestCount: 1,
      },
      {
        memorialId: mid,
        eventId: events[2].id,
        name: "Hannah Brooks",
        email: "h.brooks@example.com",
        status: "MAYBE",
        guestCount: 3,
      },
    ],
  });

  console.log(`Seeded memorial: /${SLUG} (id: ${mid})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
