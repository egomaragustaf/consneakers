import { useId } from "react";
import { conform, useForm } from "@conform-to/react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { parse } from "@conform-to/zod";
import { useRedirectTo } from "~/hooks";
import type { action as actionSignUp } from "~/routes/_auth.signup";
import { ButtonLoading, Input, InputPassword } from "~/components";
import { schemaUserSignUp } from "~/schemas";

export function UserAuthSignUpForm({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { redirectTo } = useRedirectTo();
  const lastSubmission = useActionData<typeof actionSignUp>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const id = useId();
  const [form, { email, name, username, password }] = useForm({
    id,
    shouldValidate: "onSubmit",
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserSignUp });
    },
  });

  return (
    <section className="space-y-6" {...props}>
      <Form id="user-auth-form" method="POST" {...form.props}>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              {...conform.input(email, { type: "email", description: true })}
              id={email.id}
              name="email"
              placeholder="yourname@example.com"
              autoCorrect="off"
              disabled={isSubmitting}
              autoFocus={email.error ? true : undefined}
              required
              className="border border-zinc-300"
            />
            {email.errors && email.errors?.length > 0 && (
              <ul>
                {email.errors?.map((error, index) => (
                  <li key={index}>
                    <p className="text-primary">{error}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="name">Fullname</label>
            <Input
              {...conform.input(name)}
              id={name.id}
              name="name"
              placeholder="Full name"
              disabled={isSubmitting}
              autoFocus={name.error ? true : undefined}
              required
              className="border border-zinc-300"
            />
            {name.errors && name.errors?.length > 0 && (
              <ul>
                {name.errors?.map((error, index) => (
                  <li key={index}>
                    <p className="text-primary">{error}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="username">Username</label>
            <Input
              {...conform.input(username)}
              id={username.id}
              name="username"
              placeholder="username"
              disabled={isSubmitting}
              autoFocus={username.error ? true : undefined}
              required
              className="border border-zinc-300"
            />
            {username.errors && username.errors?.length > 0 && (
              <ul>
                {username.errors?.map((error, index) => (
                  <li key={index}>
                    <p className="text-primary">{error}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <InputPassword
              {...conform.input(email, { type: "password", description: true })}
              id={password.id}
              name="password"
              placeholder="enter password"
              autoComplete="current-password"
              disabled={isSubmitting}
              autoFocus={password.error ? true : undefined}
              required
              className="border border-zinc-400"
            />
            <p>At least 8 characters</p>
          </div>

          <input hidden name="redirectTo" defaultValue={redirectTo} />
          <ButtonLoading
            type="submit"
            loadingText="Creating Account..."
            isLoading={isSubmitting}>
            Sign Up
          </ButtonLoading>
        </div>
      </Form>
    </section>
  );
}
