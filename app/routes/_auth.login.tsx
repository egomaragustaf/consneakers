import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { z } from "zod";
import { authenticator } from "~/services";

const schema = z.object({
  username: z.string(),
});

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
};

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
  const clonedRequest = request.clone();

  const formData = await clonedRequest.formData();
  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  return authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
}
