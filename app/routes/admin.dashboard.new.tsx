import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { prisma } from "~/db.server";
import { slugify } from "~/utils";
import { Layout, ButtonLoading, Sidebar } from "~/components";

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
  imageURL: zfd.text(),
});

export default function FormRoute() {
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

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
            <Form
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
                />
                <p>{fields.name.error}</p>
              </div>

              <div>
                <label htmlFor="price">Product price:</label>
                <input
                  {...conform.input(fields.price, { type: "number" })}
                  id="price"
                  className="w-full px-2 py-1 rounded-md border-gray-300 border"
                />
                <p>{fields.price.error}</p>
              </div>

              <div>
                <label htmlFor="description">Product description:</label>
                <input
                  {...conform.input(fields.description)}
                  id="description"
                  className="w-full px-2 py-1 rounded-md border-gray-300 border"
                />
                <p>{fields.description.error}</p>
              </div>

              <div>
                <label htmlFor="imageURL">Add Image:</label>
                <input
                  {...conform.input(fields.imageURL)}
                  id="imageURL"
                  className="w-full px-2 py-1 rounded-md border-gray-300 border"
                  accept="image/png, image/jpeg"
                />
                <p>{fields.description.error}</p>
              </div>

              <ButtonLoading
                type="submit"
                isSubmitting={isSubmitting}
                submittingText="Adding..."
                className="w-96 mt-4">
                Add Product
              </ButtonLoading>
            </Form>
          </section>
        </div>
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

  return redirect(`/admin/dashboard/products`);
}
