import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { prisma } from "~/db.server";
import { Layout } from "~/components/layout/layout";
import { slugify } from "~/utils";
import { ButtonLoading, Sidebar } from "~/components";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Edit Product" },
    { name: "description", content: "Edit Product" },
  ];
};

const schema = zfd.formData({
  name: zfd.text(),
  slug: zfd.text(),
  price: zfd.numeric(z.number().min(0).max(100_000_000)),
  description: zfd.text(),
  imageURL: zfd.text(),
});

export async function loader({ params }: LoaderArgs) {
  if (!params.slug) {
    return json({ product: null });
  }

  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return json({ product });
}

export default function EditProductRoute() {
  const lastSubmission = useActionData<typeof action>();
  const { product } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  if (!product) {
    return <p>Sorry, no product found.</p>;
  }

  return (
    <Layout>
      <main className="w-full flex justify-start items-start mt-32 md:mt-40">
        <div className="w-60 flex">
          <Sidebar />
        </div>

        <div className="w-full gap-6 flex flex-col justify-center items-center">
          <header className="space-y-2 w-full flex justify-start items-center">
            <h1 className="text-2xl">Edit Product</h1>
          </header>

          <Form
            key={product.id}
            method="POST"
            {...form.props}
            className="text-slate-700 w-full text-lg rounded-lg border bg-white p-4">
            <input
              {...conform.input(fields.slug)}
              type="hidden"
              name="slug"
              defaultValue={product.slug}
            />

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

            <div>
              <label htmlFor="description">Product Image:</label>
              <input
                {...conform.input(fields.imageURL)}
                id="description"
                className="w-full px-2 py-1 rounded-md border-gray-300 border"
                defaultValue={product.imageURL || ""}
              />
              <p>{fields.description.error}</p>
            </div>

            <ButtonLoading
              type="submit"
              isSubmitting={isSubmitting}
              submittingText="Updating..."
              className="w-96 mt-4">
              Update Product
            </ButtonLoading>
          </Form>
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

  const slug = submission.value.slug;

  const updateProduct = await prisma.product.update({
    where: { slug: slug },
    data: { ...submission.value, slug: slugify(submission.value.name) },
  });

  if (!updateProduct) {
    return json(submission, { status: 500 });
  }
  return redirect("/admin/dashboard/edit");
}
