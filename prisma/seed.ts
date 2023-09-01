import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import dataProducts from "~/data/products.json";
import { slugify } from "~/utils";
import dataUsersCredentials from "~/data/users-credentials.json"

const prisma = new PrismaClient();

async function main() {

  await prisma.user.deleteMany();

  await prisma.userPassword.deleteMany();
  
  for (const cred of dataUsersCredentials) {
    const hash = bcrypt.hashSync(cred.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: cred.email,
        username: cred.username,
        name: cred.name,
        password: {
          create: {
            hash,
          },
        },
      },
    });
    
    console.info(`✅ User "${newUser.username}" created`);
  }

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
      stockQuantity: product.stockQuantity,
    };
  });

  await prisma.product.createMany({
    data: newProducts,
  });
  console.info(`✅ New products created`)
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
