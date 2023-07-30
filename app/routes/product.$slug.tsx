import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout/layout";
import { prisma } from "~/db.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Consneakers" },
    { name: "description", content: "Welcome to Consneakers!" },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const product = await prisma.product.findMany();

  return json({ product });
}

export default function ProductSlugRoute() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <main className="w-full flex flex-col gap-8 justify-center items-center">
        <pre>{JSON.stringify(product, null, 2)}</pre>
      </main>
    </Layout>
  );
}
