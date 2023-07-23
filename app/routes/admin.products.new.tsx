import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { prisma } from "~/db.server";

const schema = zfd.formData({
  name: zfd.text(),
  price: zfd.numeric(z.number().min(0).max(100_000_000)),
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
    <Form method="POST" {...form.props}>
      <h1>Add New Product</h1>

      <div>
        <label htmlFor="name">Product name:</label>
        <input {...conform.input(fields.name)} />
        <p>{fields.name.error}</p>
      </div>

      <div>
        <label htmlFor="price">Product price:</label>
        <input {...conform.input(fields.price, { type: "number" })} />
        <p>{fields.price.error}</p>
      </div>

      <button type="submit">Add</button>
    </Form>
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
