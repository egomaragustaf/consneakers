import type { LoaderArgs, ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { z } from "zod";

import { model } from "~/models";
import { authenticator } from "~/services";
import { ButtonLoading, Input, InputPassword, Layout } from "~/components";
import { getRedirectTo } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Login to Consneakers" },
    { name: "description", content: "Login to Consneakers" },
  ];
};

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
      <div className="w-full lg:grid flex flex-col-reverse lg:flex-col items-center justify-center max-w-none md:grid-cols-4">
        <section className="space-y-6 mx-auto flex w-full max-w-md flex-col p-8 md:col-span-2 border border-rose-200 rounded-md shadow-2xl">
          <h1 className="text-primary text-2xl font-semibold">Login</h1>
          <p className="inline-flex flex-wrap gap-1 text-muted-foreground">
            <span>New customers?</span>
            <Link to={`/signup`} className="hover-opacity font-bold">
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

        <section className="h-full flex justify-center items-center md:col-span-2">
          <img
            // https://unsplash.com/photos/Yb_pvbQc0mc
            src="/images/login.png"
            alt="login"
            className="w-fit"
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

  const isAdmin = result.user.username === "admin";

  if (isAdmin) {
    return authenticator.authenticate("user-pass", request, {
      successRedirect: getRedirectTo(request) || "/admin/dashboard",
    });
  }
  return authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/user/dashboard",
  });
}
