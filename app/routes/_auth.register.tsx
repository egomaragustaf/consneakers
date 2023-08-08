import { Form, Link } from "@remix-run/react";
import { Button, Input, Layout } from "~/components";

export default function Route() {
  return (
    <Layout>
      <div className="w-full md:grid flex flex-col-reverse md:flex-col items-center justify-center max-w-none grid-cols-2 mt-32 md:mt-40">
        <section className="space-y-6 mx-auto flex w-full max-w-md flex-col p-8">
          <h1>Sign Up</h1>
          <p className="inline-flex flex-wrap gap-1 text-muted-foreground">
            <span>Already a Consneakers user? </span>
            <Link to={`/login`} className="hover-opacity font-bold">
              Login
            </Link>
          </p>
          <Form id="user-auth-form" method="POST">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  name="username"
                  placeholder="username"
                  autoCorrect="off"
                  required
                  className="border border-zinc-300"
                />
              </div>

              <input hidden name="redirectTo" />
              <Button type="submit">Sign Up</Button>
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
