import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card } from "~/components/ui/card";
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
      <ul className="flex">
        {products.map((product) => {
          return (
            <li key={product.id}>
              <Card>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>{product.price}</p>
              </Card>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
