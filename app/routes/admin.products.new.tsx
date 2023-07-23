import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";

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
    <Form method="post" {...form.props}>
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

      <button>Add</button>
    </Form>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  console.log(submission);

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  // Do something with the data
  return json(submission);
}
