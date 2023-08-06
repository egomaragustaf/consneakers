import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { z } from "zod";

import { authenticator } from "~/services";
import { Button, Input, Layout } from "~/components";

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
    <Layout>
      <div className="w-full grid flex-col items-center justify-center max-w-none grid-cols-2 mt-32 md:mt-40">
        <section className="space-y-6 mx-auto flex w-full max-w-md flex-col p-8">
          <Form id="user-auth-form" method="POST" {...form.props}>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="username">Username</label>
                <Input
                  {...conform.input(username)}
                  id="username"
                  name="username"
                  placeholder="username"
                  autoCorrect="off"
                  required
                  className="border border-zinc-300"
                />
                <p>{username.error}</p>
              </div>

              <input hidden name="redirectTo" />
              <Button type="submit">Login</Button>
            </div>
          </Form>
        </section>

        <section className="h-full flex justify-center items-center">
          <img
            src="/images/login.png"
            alt="login"
            className="max-w-xl rounded-lg"
          />
        </section>
      </div>
    </Layout>
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
