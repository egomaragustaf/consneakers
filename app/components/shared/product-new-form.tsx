import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import type { action as actionAddNewProduct } from "~/routes/admin.dashboard.edit.$slug";
import { ButtonLoading } from "~/components";
import { schemaAddNewProduct } from "~/schemas";
import { useRootLoaderData } from "~/hooks";

export function AddNewProductForm() {
  const { isDevelopment } = useRootLoaderData();
  const lastSubmission = useActionData<typeof actionAddNewProduct>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [form, fields] = useForm({
    shouldValidate: "onSubmit",
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaAddNewProduct });
    },
    defaultValue: isDevelopment
      ? {
          name: "New Shoes",
          price: 100000,
          description: "This product is available",
          imageURL:
            "https://ucarecdn.com/ba9550ad-7732-4562-9e0e-0d7bcd7ed575/",
          soldQuantity: 15,
          stockQuantity: 15,
        }
      : undefined,
  });

  return (
    <section className="w-full flex justify-start items-center">
      <Form
        method="PUT"
        {...form.props}
        className="text-slate-700 w-full max-w-xl text-lg rounded-lg border bg-white p-4">
        <div>
          <label htmlFor="name" className="mb-2">
            Product name:
          </label>
          <input
            {...conform.input(fields.name)}
            id="name"
            name="name"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.name.error}</p>
        </div>

        <div>
          <label htmlFor="price">Product price:</label>
          <input
            {...conform.input(fields.price, { type: "number" })}
            id="price"
            name="price"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.price.error}</p>
        </div>

        <div>
          <label htmlFor="description">Product description:</label>
          <input
            {...conform.input(fields.description)}
            id="description"
            name="description"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.description.error}</p>
        </div>

        <div>
          <label htmlFor="imageURL">Product Image:</label>
          <input
            {...conform.input(fields.imageURL)}
            id="imageURL"
            name="imageURL"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.imageURL.error}</p>
        </div>

        <div>
          <label htmlFor="soldQuantity">Sold Quantity:</label>
          <input
            {...conform.input(fields.soldQuantity)}
            id="soldQuantity"
            name="soldQuantity"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.soldQuantity.error}</p>
        </div>

        <div>
          <label htmlFor="stockQuantity">Stock Quantity:</label>
          <input
            {...conform.input(fields.stockQuantity)}
            id="stockQuantity"
            name="stockQuantity"
            className="w-full px-2 py-1 rounded-md border-gray-300 border"
          />
          <p>{fields.stockQuantity.error}</p>
        </div>

        <ButtonLoading
          type="submit"
          isSubmitting={isSubmitting}
          submittingText="Adding New Product..."
          className="w-96 mt-4">
          Add New Product
        </ButtonLoading>
      </Form>
    </section>
  );
}
