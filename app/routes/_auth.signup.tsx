import { parse } from "@conform-to/zod";
import type { V2_MetaFunction, LoaderArgs, ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Layout, UserAuthSignUpForm } from "~/components";
import { model } from "~/models";
import { authenticator } from "~/services";
import { schemaUserSignUp } from "~/schemas";
import { getRedirectTo } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Sign Up to Consneakers" },
    { name: "description", content: "Sign Up to Consneakers" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
};

export default function Route() {
  return (
    <Layout>
      <div className="w-full lg:grid flex flex-col-reverse lg:flex-col items-center justify-center max-w-none md:grid-cols-4">
        <section className="space-y-6 mx-auto flex w-full max-w-md flex-col p-8 md:col-span-2 border border-rose-200 rounded-md shadow-2xl">
          <h1 className="text-primary text-2xl font-semibold">Sign Up</h1>
          <p className="inline-flex flex-wrap gap-1 text-muted-foreground">
            <span>Already a Consneakers user? </span>
            <Link to={`/login`} className="hover-opacity font-bold">
              Login
            </Link>
          </p>
          <UserAuthSignUpForm />
        </section>

        <section className="h-full flex justify-center items-center md:col-span-2">
          <img
            // https://unsplash.com/photos/rniFdQKztF8
            src="/images/signup.png"
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
  const submission = parse(formData, { schema: schemaUserSignUp });

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 });
  }

  const result = await model.user.mutation.signup(submission.value);
  if (result.error) {
    return json({ ...submission, error: result.error });
  }

  return authenticator.authenticate("user-pass", request, {
    successRedirect: getRedirectTo(request) || "/user/dashboard",
  });
}
