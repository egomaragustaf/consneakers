import { PrismaClient } from "@prisma/client";

import dataProducts from "~/data/products.json";
import { slugify } from "~/utils";

const prisma = new PrismaClient();

async function main() {
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
