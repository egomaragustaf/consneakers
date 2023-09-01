import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { prisma } from "~/db.server";
import {
  Layout,
  Sidebar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { formatValueToCurrency } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dashboard Products" },
    { name: "description", content: "Dashboard Products" },
  ];
};

export async function loader() {
  const products = await prisma.product.findMany();

  return json({ products });
}

export default function Route() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <main className="flex gap-8 justify-start items-start ">
        <div className="w-60 flex">
          <Sidebar />
        </div>

        <div className="w-full gap-6 flex flex-col justify-center items-center">
          <header className="space-y-2 w-full flex justify-start items-center">
            <h1 className="text-2xl">All Products</h1>
          </header>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.imageURL || ""}
                        alt={product.slug}
                        className="w-12"
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      {formatValueToCurrency(product.price)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </Layout>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const deleteProductId = formData.get("delete");

  if (formData.has("delete")) {
    try {
      const productId: any = deleteProductId;

      await prisma.product.delete({
        where: { id: productId },
      });

      return redirect("/admin/products/");
    } catch (error) {
      console.error("Error deleting product");
      return json({ error: "Failed to delete the product" }, { status: 500 });
    }
  }

  return json({ error: "Invalid request" }, { status: 400 });
}
