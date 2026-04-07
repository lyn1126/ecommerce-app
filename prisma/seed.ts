import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error"] });

type SeedCategory = {
  name: string;
  slug: string;
};

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
  featured: boolean;
  categorySlug: string;
};

const categoriesData: SeedCategory[] = [
  { name: "\u00c1o thun n\u1eef", slug: "ao-thun-nu" },
  { name: "\u00c1o s\u01a1 mi n\u1eef", slug: "ao-so-mi-nu" },
  { name: "Qu\u1ea7n jean n\u1eef", slug: "quan-jean-nu" },
  { name: "Ch\u00e2n v\u00e1y", slug: "chan-vay" },
  { name: "\u00c1o kho\u00e1c", slug: "ao-khoac" },
];

const productsData: SeedProduct[] = [
  {
    name: "\u00c1o thun n\u1eef basic",
    slug: "ao-thun-nu-basic",
    description:
      "\u00c1o thun n\u1eef form regular, ch\u1ea5t v\u1ea3i m\u1ec1m v\u00e0 d\u1ec5 m\u1eb7c h\u1eb1ng ng\u00e0y.",
    price: "219000",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200"],
    featured: true,
    categorySlug: "ao-thun-nu",
  },
  {
    name: "\u00c1o thun n\u1eef c\u1ed5 tr\u00f2n",
    slug: "ao-thun-nu-co-tron",
    description:
      "\u00c1o thun n\u1eef c\u1ed5 tr\u00f2n t\u1ed1i gi\u1ea3n, ph\u00f9 h\u1ee3p \u0111i h\u1ecdc, \u0111i ch\u01a1i v\u00e0 \u0111i l\u00e0m.",
    price: "249000",
    stock: 18,
    images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200"],
    featured: false,
    categorySlug: "ao-thun-nu",
  },
  {
    name: "\u00c1o s\u01a1 mi n\u1eef tay d\u00e0i",
    slug: "ao-so-mi-nu-tay-dai",
    description:
      "\u00c1o s\u01a1 mi n\u1eef tay d\u00e0i thanh l\u1ecbch, ch\u1ea5t li\u1ec7u d\u1ec5 \u1ee7i v\u00e0 d\u1ec5 ph\u1ed1i \u0111\u1ed3.",
    price: "329000",
    stock: 16,
    images: ["https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1200"],
    featured: true,
    categorySlug: "ao-so-mi-nu",
  },
  {
    name: "\u00c1o s\u01a1 mi n\u1eef c\u00f4ng s\u1edf",
    slug: "ao-so-mi-nu-cong-so",
    description:
      "\u00c1o s\u01a1 mi n\u1eef phong c\u00e1ch c\u00f4ng s\u1edf, gam m\u00e0u nh\u1eb9 v\u00e0 d\u1ec5 m\u1eb7c h\u1eb1ng ng\u00e0y.",
    price: "359000",
    stock: 12,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200"],
    featured: false,
    categorySlug: "ao-so-mi-nu",
  },
  {
    name: "Qu\u1ea7n jean n\u1eef slim fit",
    slug: "quan-jean-nu-slim-fit",
    description:
      "Qu\u1ea7n jean n\u1eef slim fit t\u00f4n d\u00e1ng, ch\u1ea5t denim m\u1ec1m v\u00e0 c\u00f3 \u0111\u1ed9 co gi\u00e3n nh\u1eb9.",
    price: "469000",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200"],
    featured: false,
    categorySlug: "quan-jean-nu",
  },
  {
    name: "Qu\u1ea7n jean n\u1eef \u1ed1ng r\u1ed9ng",
    slug: "quan-jean-nu-ong-rong",
    description:
      "Qu\u1ea7n jean n\u1eef \u1ed1ng r\u1ed9ng phong c\u00e1ch tr\u1ebb trung, d\u1ec5 ph\u1ed1i c\u00f9ng \u00e1o thun v\u00e0 \u00e1o kho\u00e1c.",
    price: "499000",
    stock: 14,
    images: ["https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1200"],
    featured: true,
    categorySlug: "quan-jean-nu",
  },
  {
    name: "Ch\u00e2n v\u00e1y x\u1ebfp ly",
    slug: "chan-vay-xep-ly",
    description:
      "Ch\u00e2n v\u00e1y x\u1ebfp ly n\u1eef t\u00ednh, ph\u00f9 h\u1ee3p \u0111i l\u00e0m v\u00e0 \u0111i ch\u01a1i cu\u1ed1i tu\u1ea7n.",
    price: "289000",
    stock: 22,
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a13d77?q=80&w=1200"],
    featured: false,
    categorySlug: "chan-vay",
  },
  {
    name: "Ch\u00e2n v\u00e1y jean ng\u1eafn",
    slug: "chan-vay-jean-ngan",
    description:
      "Ch\u00e2n v\u00e1y jean ng\u1eafn n\u0103ng \u0111\u1ed9ng, d\u1ec5 k\u1ebft h\u1ee3p v\u1edbi \u00e1o thun v\u00e0 sneaker.",
    price: "319000",
    stock: 17,
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200"],
    featured: true,
    categorySlug: "chan-vay",
  },
  {
    name: "\u00c1o kho\u00e1c cardigan m\u1ecfng",
    slug: "ao-khoac-cardigan-mong",
    description:
      "\u00c1o kho\u00e1c cardigan m\u1ecfng nh\u1eb9, ph\u00f9 h\u1ee3p th\u1eddi ti\u1ebft m\u00e1t v\u00e0 d\u1ec5 layer.",
    price: "389000",
    stock: 11,
    images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200"],
    featured: true,
    categorySlug: "ao-khoac",
  },
  {
    name: "\u00c1o kho\u00e1c blazer n\u1eef",
    slug: "ao-khoac-blazer-nu",
    description:
      "\u00c1o kho\u00e1c blazer n\u1eef d\u00e1ng su\u00f4ng, phong c\u00e1ch thanh l\u1ecbch cho nhi\u1ec1u d\u1ecbp.",
    price: "559000",
    stock: 9,
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"],
    featured: false,
    categorySlug: "ao-khoac",
  },
];

async function seedCategories() {
  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
}

async function seedProducts() {
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });

  const categoryMap = new Map(categories.map((item) => [item.slug, item.id]));

  for (const product of productsData) {
    const categoryId = categoryMap.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category for slug: ${product.categorySlug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        featured: product.featured,
        categoryId,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        featured: product.featured,
        categoryId,
      },
    });
  }
}

async function main() {
  await seedCategories();
  await seedProducts();

  const [categoryCount, productCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
  ]);

  console.log(JSON.stringify({ categoryCount, productCount }, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
