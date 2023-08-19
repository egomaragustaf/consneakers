import { json } from "@remix-run/node";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";
import {
  BannerCarousel,
  ProductCard,
  Layout,
  getPaginationConfigs,
  getPaginationOptions,
  PaginationNavigation,
} from "~/components";
import { prisma } from "~/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Consneakers" },
    { name: "description", content: "Welcome to Consneakers!" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const config = getPaginationConfigs({ request, defaultLimit: 10 });

  // Custom query config
  const where = !config.queryParam
    ? {}
    : { OR: [{ name: { contains: config.queryParam } }] };

  const [totalItems, items] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: config.skip,
      take: config.limitParam,
    }),
  ]);

  return json({ ...getPaginationOptions({ request, totalItems }), items });
};

export default function Index() {
  return (
    <Layout>
      <LandingHero />
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

export function LandingAllProduct() {
  const { items: products, ...loaderData } = useLoaderData<typeof loader>();

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

      <PaginationNavigation {...loaderData} />
    </article>
  );
}
