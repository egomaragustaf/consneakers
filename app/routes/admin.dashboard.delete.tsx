import type { V2_MetaFunction, ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { prisma } from "~/db.server";
import { Layout } from "~/components/layout/layout";
import {
  Button,
  Sidebar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Delete Products" },
    { name: "description", content: "Delete Products" },
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
      <main className="flex gap-8 justify-start items-start">
        <div className="w-60 flex">
          <Sidebar />
        </div>

        <div className="w-full gap-6 flex flex-col justify-center items-center">
          <header className="space-y-2 w-full flex justify-start items-center">
            <h1 className="text-2xl">Delete Products</h1>
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
                      Rp {product.price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Form method="POST">
                        <Button type="submit" name="delete" value={product.id}>
                          Delete
                        </Button>
                      </Form>
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

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const deleteProductId = formData.get("delete") as string | undefined;

  if (formData.has("delete")) {
    try {
      const productId = deleteProductId;

      await prisma.product.delete({
        where: { id: productId },
      });

      return redirect("/admin/dashboard/delete");
    } catch (error) {
      console.error("Error deleting product");
      return json({ error: "Failed to delete the product" }, { status: 500 });
    }
  }

  return json({ error: "Invalid request" }, { status: 400 });
};
