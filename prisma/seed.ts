import { PrismaClient } from "@prisma/client";

import dataProducts from "~/data/products.json";
import { slugify } from "~/utils";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const newUser = await prisma.user.create({
    data: {
      email: "admin@consneakers.com",
      username: "admin",
      name: "Admin",
    },
  });
  if (!newUser) return null;
  console.log(`User "${newUser.username}" created`);

  await prisma.product.deleteMany();

  const newProducts = dataProducts.map((product) => {
    return {
      slug: slugify(product.name),
      name: product.name,
      price: product.price,
      description: product.description,
    };
  });

  await prisma.product.createMany({
    data: newProducts,
  });
}

main()
  .then(async () => {
    console.log("Seeding complete");
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    console.log("Seeding failed");
    prisma.$disconnect();
    process.exit(1);
  });
