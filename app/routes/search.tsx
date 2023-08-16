import { json, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout, ProductCard } from "~/components";
import { prisma } from "~/db.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) return json({ query, count: 0, products: [] });

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

  const productsCount = products.length;
  const count = productsCount;

  return json({ query, count, products });
};

export default function Route() {
  const { query, count, products } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="w-full flex flex-col gap-4 justify-center items-center ">
        {!query && (
          <section>
            <h2 className="text-2xl font-bold">
              Please, enter your search keyword above!
            </h2>
          </section>
        )}

        {count <= 0 && query && (
          <section>
            <h2 className="text-2xl font-bold">
              No result found for keyword "{query}"
            </h2>
          </section>
        )}

        {products.length > 0 && (
          <section className="space-y-2">
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Found {products.length} with keyword "{query}"
            </p>

            <section className="w-full max-w-7xl flex justify-center items-center">
              <ul className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
