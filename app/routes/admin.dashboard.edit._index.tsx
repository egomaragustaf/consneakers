import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

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
    { title: "Edit Products" },
    { name: "description", content: "Edit Products" },
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
            <h1 className="text-2xl">Edit Products</h1>
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
                      <Link to={`/admin/dashboard/edit/${product.slug}`}>
                        <Button variant="link">Edit</Button>
                      </Link>
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
