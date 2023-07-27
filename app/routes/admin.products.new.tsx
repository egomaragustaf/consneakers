import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { prisma } from "~/db.server";
import { Layout } from "~/components/layout/layout";

const schema = zfd.formData({
  name: zfd.text(),
  price: zfd.numeric(z.number().min(0).max(100_000_000)),
  description: zfd.text(),
});

export default function FormRoute() {
  const lastSubmission = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  return (
    <Layout>
      <Form
        method="POST"
        {...form.props}
        className="text-slate-700 text-lg block max-w-md rounded-lg bg-white p-6">
        <h1>Add New Product</h1>

        <div>
          <label htmlFor="name" className="mb-2">
            Product name:
          </label>
          <input
            {...conform.input(fields.name)}
            id="name"
            className="w-full px-2 py-1 block rounded-md border-gray-300 border"
          />
          <p>{fields.name.error}</p>
        </div>

        <div>
          <label htmlFor="price">Product price:</label>
          <input
            {...conform.input(fields.price, { type: "number" })}
            id="price"
            className="w-full px-2 py-1 block rounded-md border-gray-300 border"
          />
          <p>{fields.price.error}</p>
        </div>

        <div>
          <label htmlFor="description">Product description:</label>
          <input
            {...conform.input(fields.description)}
            id="description"
            className="w-full px-2 py-1 block rounded-md border-gray-300 border"
          />
          <p>{fields.description.error}</p>
        </div>

        <button type="submit">Add</button>
      </Form>
    </Layout>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  const newProduct = await prisma.product.create({
    data: submission.value,
  });

  if (!newProduct) {
    return json(submission, { status: 500 });
  }

  return json(submission);
}
