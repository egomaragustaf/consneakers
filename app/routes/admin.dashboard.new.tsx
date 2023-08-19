import { parse } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";

import { prisma } from "~/db.server";
import { slugify } from "~/utils";
import { AddNewProductForm, Layout, Sidebar } from "~/components";
import { schemaAddNewProduct } from "~/shcemas";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Add New Product" },
    { name: "description", content: "Add New Product" },
  ];
};

export default function FormRoute() {
  return (
    <Layout>
      <main className="w-full flex justify-start items-start ">
        <div className="w-60 flex">
          <Sidebar />
        </div>

        <div className="w-full gap-6 flex flex-col justify-start items-center">
          <header className="space-y-2 w-full">
            <h1 className="text-2xl">Add New Product</h1>
          </header>

          <section className="w-full flex justify-start items-center">
            <AddNewProductForm />
          </section>
        </div>
      </main>
    </Layout>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaAddNewProduct });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  const slug = slugify(submission.value.name);

  const newProduct = await prisma.product.create({
    data: { ...submission.value, slug },
  });

  if (!newProduct) {
    return json(submission, { status: 500 });
  }

  return redirect(`/admin/dashboard/products`);
}
