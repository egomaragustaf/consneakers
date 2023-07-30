import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { prisma } from "~/db.server";

const schema = z.object({
  username: z.string(),
});

export default function FormRoute() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { username }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  return (
    <Form method="post" {...form.props}>
      <div>
        <label htmlFor="username">Username:</label>
        <input {...conform.input(username)} id="username" />
        <p>{username.error}</p>
      </div>

      <button type="submit">Login</button>
    </Form>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { username: submission.value.username },
  });

  console.log({ user });

  // Do something with the data
  return json(submission);
}
