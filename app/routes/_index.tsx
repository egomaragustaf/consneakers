import { json, type V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { BannerCarousel, ProductCard, Layout } from "~/components";
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

  const popularProducts = await prisma.product.findMany();

  return json({ products, popularProducts });
}

export default function Index() {
  return (
    <Layout>
      <LandingHero />
      <LandingPopularProduct />
      <LandingAllProduct />
    </Layout>
  );
}

export function LandingHero() {
  return (
    <article className="w-full flex flex-col gap-4 justify-center items-center">
      <BannerCarousel />
    </article>
  );
}

export function LandingPopularProduct() {
  const { popularProducts } = useLoaderData<typeof loader>();

  const filteredProducts = popularProducts.filter(
    (product) =>
      product.soldQuantity !== null && product.soldQuantity !== undefined
  );

  return (
    <article className="w-full flex flex-col gap-4 justify-center items-center">
      <header className="w-full max-w-7xl">
        <h1 className="text-2xl font-bold">Popular Products</h1>
      </header>

      <section className="w-full max-w-7xl flex justify-center items-center">
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            if (product.soldQuantity !== null && product.soldQuantity >= 30) {
              return (
                <li key={product.id}>
                  <Link to={`/products/${product.slug}`}>
                    <ProductCard product={product as any} />
                  </Link>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </section>
    </article>
  );
}

export function LandingAllProduct() {
  const { products } = useLoaderData<typeof loader>();

  return (
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
  );
}
