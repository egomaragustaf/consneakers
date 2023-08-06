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

  await prisma.cart.deleteMany()
  
  await prisma.cartItem.deleteMany()

  const newProducts = dataProducts.map((product) => {
    return {
      slug: slugify(product.name),
      name: product.name,
      price: product.price,
      description: product.description,
      imageURL: product.imageURL,
      soldQuantity: product.soldQuantity || 0,
    };
  });

  await prisma.product.createMany({
    data: newProducts,
  });
  console.log(`New products created`)
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
