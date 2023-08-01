import { json, type V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout/layout";
import { ProductCard } from "~/components";
import { prisma } from "~/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Consneakers" },
    { name: "description", content: "Welcome to Consneakers!" },
  ];
};

export async function loader() {
  const products = await prisma.product.findMany({
    take: 10,
  });

  return json({ products });
}

export default function Index() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <main className="w-full flex flex-col gap-8 justify-center items-center">
        <header className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold">All Product</h1>
        </header>

        <section className="w-full max-w-7xl flex justify-center items-center">
          <ul className="grid grid-cols-5 gap-4">
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
      </main>
    </Layout>
  );
}
