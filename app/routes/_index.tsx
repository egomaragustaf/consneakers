import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
      <div className="grid grid-cols-5 gap-2">
        {products.map((product) => {
          return (
            <ul key={product.id}>
              <li>{product.name}</li>
              <li>{product.description}</li>
              <li>{product.price}</li>
            </ul>
          );
        })}
      </div>
    </main>
  );
}
