import { json, type V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout/layout";
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
    <Layout>
      <main className="w-full gap-8 justify-center items-center">
        <h1>Consneakers</h1>

        {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
        <ul className="flex gap-2 flex-wrap">
          {products.map((product) => {
            return (
              <li key={product.id}>
                <Link to={`/products/${product.slug}`}>
                  <ProductCard product={product as any} />
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </Layout>
  );
}
