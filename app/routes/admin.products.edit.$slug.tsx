import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { prisma } from "~/db.server";
import { Layout } from "~/components/layout/layout";
import { slugify } from "~/utils/slugify";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Add New Product" },
    { name: "description", content: "Add New Product" },
  ];
};

const schema = zfd.formData({
  name: zfd.text(),
  price: zfd.numeric(z.number().min(0).max(100_000_000)),
  description: zfd.text(),
});

export async function loader({ params }: LoaderArgs) {
  const slug = params.slug;
  const products = await prisma.product.findMany({
    where: {
      slug: slug,
    },
  });

  return json({ products });
}

export default function EditProductRoute() {
  const lastSubmission = useActionData<typeof action>();
  const { products } = useLoaderData<typeof loader>();
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  if (!products) {
    return <p>Sorry, no product found.</p>;
  }

  return (
    <Layout>
      <main className="w-full flex flex-col gap-8 justify-center items-center">
        <header className="space-y-2">
          <h1 className="text-2xl">Add New Product</h1>
          <p>add product below</p>
        </header>

        {products.map((product) => {
          return (
            <Form
              key={product.id}
              method="POST"
              {...form.props}
              className="text-slate-700 w-full max-w-xl text-lg rounded-lg border bg-white p-4">
              <div>
                <label htmlFor="name" className="mb-2">
                  Product name:
                </label>
                <input
                  {...conform.input(fields.name)}
                  id="name"
                  className="w-full px-2 py-1 rounded-md border-gray-300 border"
                  defaultValue={product.name}
                />
                <p>{fields.name.error}</p>
              </div>

              <div>
                <label htmlFor="price">Product price:</label>
                <input
                  {...conform.input(fields.price, { type: "number" })}
                  id="price"
                  className="w-full px-2 py-1 rounded-md border-gray-300 border"
                  defaultValue={product.price}
                />
                <p>{fields.price.error}</p>
              </div>

              <div>
                <label htmlFor="description">Product description:</label>
                <input
                  {...conform.input(fields.description)}
                  id="description"
                  className="w-full px-2 py-1 rounded-md border-gray-300 border"
                  defaultValue={product.description || ""}
                />
                <p>{fields.description.error}</p>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-md border-gray-300 text-white bg-slate-800 hover:bg-slate-900 border mt-4">
                Update Product
              </button>
            </Form>
          );
        })}
      </main>
    </Layout>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

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

  return redirect(`/admin/products`);
}
