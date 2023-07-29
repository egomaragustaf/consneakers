import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { prisma } from "~/db.server";
import { Layout } from "~/components/layout/layout";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Products Action" },
    { name: "description", content: "Products Action Page" },
  ];
};

export async function loader() {
  const products = await prisma.product.findMany();

  return json({ products });
}

export default function ProductActionRoute() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <main className="w-full flex flex-col gap-8 justify-center items-center">
        <header className="space-y-2">
          <h1 className="text-2xl">Product Action</h1>
          <p>this is admin page to manage product</p>
        </header>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td className="flex gap-2">
                    <Link to={`/admin/products/edit/${product.slug}`}>
                      Edit
                    </Link>

                    <Form method="POST">
                      <button
                        type="submit"
                        name="delete"
                        value={product.id}
                        className="bg-rose-400">
                        Delete
                      </button>
                    </Form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Link to={`/admin/products/new`}>
          <button className="bg-green-400 p-2">Add New Product</button>
        </Link>
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
