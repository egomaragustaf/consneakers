import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import type { action as actionAddNewProduct } from "~/routes/admin.dashboard.new";
import { ButtonLoading } from "~/components";
import { schemaAddNewProduct } from "~/schemas";

export function AddNewProductForm() {
  const lastSubmission = useActionData<typeof actionAddNewProduct>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaAddNewProduct });
    },
  });

  return (
    <section className="w-full flex justify-start items-center">
      <Form
        method="POST"
        {...form.props}
        className="text-slate-700 w-full max-w-xl text-lg rounded-lg border bg-white p-4">
        <div>
          <label htmlFor="name" className="mb-2">
            Product name:
          </label>
          <input
            {...conform.input(fields.name)}
            id="name"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.name.error}</p>
        </div>

        <div>
          <label htmlFor="price">Product price:</label>
          <input
            {...conform.input(fields.price, { type: "number" })}
            id="price"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.price.error}</p>
        </div>

        <div>
          <label htmlFor="description">Product description:</label>
          <input
            {...conform.input(fields.description)}
            id="description"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.description.error}</p>
        </div>

        <div>
          <label htmlFor="imageURL">Add Image:</label>
          <input
            {...conform.input(fields.imageURL)}
            id="imageURL"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
            accept="image/png, image/jpeg"
          />
          <p>{fields.description.error}</p>
        </div>

        <ButtonLoading
          type="submit"
          isSubmitting={isSubmitting}
          submittingText="Adding..."
          className="w-96 mt-4">
          Add Product
        </ButtonLoading>
      </Form>
    </section>
  );
}
