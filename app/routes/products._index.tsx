import { json, type LoaderArgs } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout, ProductCard } from "~/components";
import { prisma } from "~/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "All Products" },
    { name: "description", content: "All Products" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const products = await prisma.product.findMany();

  return json({ products });
};

export default function Route() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <article className="w-full flex flex-col gap-4 justify-center items-center">
        <header className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold">All Products</h1>
        </header>

        <section className="w-full max-w-7xl flex justify-center items-center">
          <ul className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
        </section>
      </article>
    </Layout>
  );
}
