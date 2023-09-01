import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout, ProductCard } from "~/components";
import { prisma } from "~/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Search Products" },
    { name: "description", content: "Search Products" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    const products = await prisma.product.findMany({
      take: 50,
    });

    return json({ query, count: products.length, products });
  }

  const [products] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      select: {
        id: true,
        slug: true,
        imageURL: true,
        name: true,
        price: true,
        soldQuantity: true,
        description: true,
      },
      orderBy: [{ name: "asc" }],
    }),
  ]);

  return json({ query, count: products.length, products });
};

export default function Route() {
  const { query, count, products } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        {count > 0 && (
          <section className="space-y-2 min-h-screen">
            <h1 className="text-2xl font-bold">All Products</h1>
            {query && (
              <p className="text-muted-foreground">
                Found {products.length} with keyword "{query}"
              </p>
            )}

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
          </section>
        )}
      </div>
    </Layout>
  );
}
