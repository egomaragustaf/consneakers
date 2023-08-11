import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { z } from "zod";

import { model } from "~/models";
import { authenticator } from "~/services";
import { ButtonLoading, Input, InputPassword, Layout } from "~/components";
import { getRedirectTo } from "~/utils";

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
};

export default function FormRoute() {
  const lastSubmission = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [form, { username, password }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  return (
    <Layout>
      <div className="w-full md:grid flex flex-col-reverse md:flex-col items-center justify-center max-w-none grid-cols-2 mt-32 md:mt-40">
        <section className="space-y-6 mx-auto flex w-full max-w-md flex-col p-8">
          <h1>Login</h1>
          <p className="inline-flex flex-wrap gap-1 text-muted-foreground">
            <span>New customers?</span>
            <Link to={`/register`} className="hover-opacity font-bold">
              Sign Up
            </Link>
          </p>
          <Form id="user-auth-form" method="POST" {...form.props}>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor={username.id}>Username</label>
                <Input
                  {...conform.input(username)}
                  id={username.id}
                  name="username"
                  placeholder="username"
                  autoCorrect="off"
                  disabled={isSubmitting}
                  autoFocus={username.error ? true : undefined}
                  required
                  className="border border-zinc-400"
                />
                <p className="text-primary">{username.error}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor={password.id}>Password</label>
                <InputPassword
                  {...conform.input(password)}
                  id={password.id}
                  name="password"
                  placeholder="enter password"
                  disabled={isSubmitting}
                  autoFocus={password.error ? true : undefined}
                  required
                  className="border border-zinc-400"
                />
                <p className="text-primary">{password.error}</p>
              </div>

              <input hidden name="redirectTo" />
              <ButtonLoading
                type="submit"
                loadingText="Logging in..."
                isLoading={isSubmitting}>
                Login
              </ButtonLoading>
            </div>
          </Form>
        </section>

        <section className="h-full flex justify-center items-center">
          <img
            src="/images/login.png"
            alt="login"
            className="w-72 md:w-full md:max-w-xl rounded-md"
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

  const result = await model.user.mutation.login(submission.value);
  if (result.error) {
    return json({ ...submission, error: result.error });
  }

  return authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/dashboard",
  });
}
