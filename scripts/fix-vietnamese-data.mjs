import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: ["error"],
});

const categories = [
  ["ao-thun-nu", "\u00c1o thun n\u1eef"],
  ["ao-so-mi-nu", "\u00c1o s\u01a1 mi n\u1eef"],
  ["quan-jean-nu", "Qu\u1ea7n jean n\u1eef"],
  ["chan-vay", "Ch\u00e2n v\u00e1y"],
  ["ao-khoac", "\u00c1o kho\u00e1c"],
];

const products = [
  [
    "ao-thun-nu-basic",
    "\u00c1o thun n\u1eef basic",
    "\u00c1o thun n\u1eef form regular, ch\u1ea5t v\u1ea3i m\u1ec1m v\u00e0 d\u1ec5 m\u1eb7c h\u1eb1ng ng\u00e0y.",
  ],
  [
    "ao-thun-nu-co-tron",
    "\u00c1o thun n\u1eef c\u1ed5 tr\u00f2n",
    "\u00c1o thun n\u1eef c\u1ed5 tr\u00f2n t\u1ed1i gi\u1ea3n, ph\u00f9 h\u1ee3p \u0111i h\u1ecdc, \u0111i ch\u01a1i v\u00e0 \u0111i l\u00e0m.",
  ],
  [
    "ao-so-mi-nu-tay-dai",
    "\u00c1o s\u01a1 mi n\u1eef tay d\u00e0i",
    "\u00c1o s\u01a1 mi n\u1eef tay d\u00e0i thanh l\u1ecbch, ch\u1ea5t li\u1ec7u d\u1ec5 \u1ee7i v\u00e0 d\u1ec5 ph\u1ed1i \u0111\u1ed3.",
  ],
  [
    "ao-so-mi-nu-cong-so",
    "\u00c1o s\u01a1 mi n\u1eef c\u00f4ng s\u1edf",
    "\u00c1o s\u01a1 mi n\u1eef phong c\u00e1ch c\u00f4ng s\u1edf, gam m\u00e0u nh\u1eb9 v\u00e0 d\u1ec5 m\u1eb7c h\u1eb1ng ng\u00e0y.",
  ],
  [
    "quan-jean-nu-slim-fit",
    "Qu\u1ea7n jean n\u1eef slim fit",
    "Qu\u1ea7n jean n\u1eef slim fit t\u00f4n d\u00e1ng, ch\u1ea5t denim m\u1ec1m v\u00e0 c\u00f3 \u0111\u1ed9 co gi\u00e3n nh\u1eb9.",
  ],
  [
    "quan-jean-nu-ong-rong",
    "Qu\u1ea7n jean n\u1eef \u1ed1ng r\u1ed9ng",
    "Qu\u1ea7n jean n\u1eef \u1ed1ng r\u1ed9ng phong c\u00e1ch tr\u1ebb trung, d\u1ec5 ph\u1ed1i c\u00f9ng \u00e1o thun v\u00e0 \u00e1o kho\u00e1c.",
  ],
  [
    "chan-vay-xep-ly",
    "Ch\u00e2n v\u00e1y x\u1ebfp ly",
    "Ch\u00e2n v\u00e1y x\u1ebfp ly n\u1eef t\u00ednh, ph\u00f9 h\u1ee3p \u0111i l\u00e0m v\u00e0 \u0111i ch\u01a1i cu\u1ed1i tu\u1ea7n.",
  ],
  [
    "chan-vay-jean-ngan",
    "Ch\u00e2n v\u00e1y jean ng\u1eafn",
    "Ch\u00e2n v\u00e1y jean ng\u1eafn n\u0103ng \u0111\u1ed9ng, d\u1ec5 k\u1ebft h\u1ee3p v\u1edbi \u00e1o thun v\u00e0 sneaker.",
  ],
  [
    "ao-khoac-cardigan-mong",
    "\u00c1o kho\u00e1c cardigan m\u1ecfng",
    "\u00c1o kho\u00e1c cardigan m\u1ecfng nh\u1eb9, ph\u00f9 h\u1ee3p th\u1eddi ti\u1ebft m\u00e1t v\u00e0 d\u1ec5 layer.",
  ],
  [
    "ao-khoac-blazer-nu",
    "\u00c1o kho\u00e1c blazer n\u1eef",
    "\u00c1o kho\u00e1c blazer n\u1eef d\u00e1ng su\u00f4ng, phong c\u00e1ch thanh l\u1ecbch cho nhi\u1ec1u d\u1ecbp.",
  ],
];

async function main() {
  for (const [slug, name] of categories) {
    await prisma.category.update({
      where: { slug },
      data: { name },
    });
  }

  for (const [slug, name, description] of products) {
    await prisma.product.update({
      where: { slug },
      data: { name, description },
    });
  }

  const preview = await prisma.product.findMany({
    select: { slug: true, name: true, description: true },
    orderBy: { slug: "asc" },
    take: 3,
  });

  console.log(JSON.stringify(preview, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
