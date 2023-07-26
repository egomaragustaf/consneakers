import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProductCard } from "~/components/shared/product-card";
import { prisma } from "~/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Consneakers" },
    { name: "description", content: "Welcome to Consneakers!" },
  ];
};

export async function loader() {
  const products = await prisma.product.findMany();

  return json({ products });
}

export default function Index() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>Consneakers</h1>

      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
      <ul className="flex gap-2">
        {products.map((product) => {
          return (
            <li key={product.id}>
              <ProductCard product={product as any} />
            </li>
          );
        })}
      </ul>
    </main>
  );
}
