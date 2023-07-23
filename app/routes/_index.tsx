import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Consneakers" },
    { name: "description", content: "Welcome to Consneakers!" },
  ];
};

export async function loader() {
  const products = [
    {
      id: 1,
      name: "Converse Run Star Hike Hi Black White",
      price: 1_299_000,
      createdAt: new Date(),
    },
  ];

  return json({ products });
}

export default function Index() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>Consneakers</h1>

      <pre>{JSON.stringify(products, null, 2)}</pre>
    </main>
  );
}
