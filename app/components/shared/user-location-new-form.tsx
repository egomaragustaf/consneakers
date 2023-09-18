import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import type { action as actionAddNewUserLocation } from "~/routes/_user.checkout";
import {
  ButtonLoading,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "~/components";
import { schemaAddNewUserLocation } from "~/schemas";
import { useRootLoaderData } from "~/hooks";

export function AddNewUserLocationForm() {
  const { isDevelopment } = useRootLoaderData();
  const lastSubmission = useActionData<typeof actionAddNewUserLocation>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [form, fields] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaAddNewUserLocation });
    },
    defaultValue: isDevelopment
      ? {
          label: "Home",
          address: "Joyotakan RT01 / RW06",
          countryCode: "ID",
          province: "Jawa Tengah",
          city: "Surakarta",
          district: "Serengan",
          subDistrict: "Joyotakan",
          street: "Jalan Kahayan no 6",
          streetDetails: "Jalan Kahayan no 6, Joyotakan RT01 / RW06",
          mapsURL: "https://maps.app.goo.gl/mA8ieRFCETJyH2588",
          postalCode: 57157,
          latitude: -7.586546,
          longitude: 110.817448,
        }
      : undefined,
  });

  return (
    <DialogContent className="max-w-7xl w-full">
      <DialogHeader>
        <DialogTitle>Add Address</DialogTitle>
        <DialogDescription>Add your shipping address</DialogDescription>
      </DialogHeader>
      <Form method="POST" {...form.props}>
        <div className="grid gap-4 py-4 w-1/2">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="label" className="text-right">
              Label
            </label>
            <Input
              {...conform.input(fields.label)}
              id="label"
              placeholder="label"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="address" className="text-right">
              Address
            </label>
            <Input
              {...conform.input(fields.address)}
              id="address"
              placeholder="Address"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="country" className="text-right">
              Country
            </label>
            <Input
              {...conform.input(fields.countryCode)}
              id="country"
              placeholder="Country"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="province" className="text-right">
              Province
            </label>
            <Input
              {...conform.input(fields.province)}
              id="province"
              placeholder="province"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="city" className="text-right">
              City
            </label>
            <Input
              {...conform.input(fields.city)}
              id="city"
              placeholder="City"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="district" className="text-right">
              District
            </label>
            <Input
              {...conform.input(fields.district)}
              id="district"
              placeholder="District"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="subdistrict" className="text-right">
              Sub District
            </label>
            <Input
              {...conform.input(fields.subDistrict)}
              id="subdistrict"
              placeholder="Sub District"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="street" className="text-right">
              Street
            </label>
            <Input
              {...conform.input(fields.street)}
              id="street"
              placeholder="Street"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="streetDetails" className="text-right">
              Street Details
            </label>
            <Input
              {...conform.input(fields.streetDetails)}
              id="streetDetails"
              placeholder="Street Details"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="postalcode" className="text-right">
              Postal Code
            </label>
            <Input
              {...conform.input(fields.postalCode)}
              id="postalcode"
              placeholder="Postal Code"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="mapsURL" className="text-right">
              Maps URL
            </label>
            <Input
              {...conform.input(fields.mapsURL)}
              id="mapsURL"
              placeholder="Maps URL"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="latitude" className="text-right">
              Latitude
            </label>
            <Input
              {...conform.input(fields.latitude)}
              id="latitude"
              placeholder="Latitude"
              className="col-span-3 border"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="longitude" className="text-right">
              Longitude
            </label>
            <Input
              {...conform.input(fields.longitude)}
              id="longitude"
              placeholder="Longitude"
              className="col-span-3 border"
            />
          </div>

          <DialogFooter className="flex gap-x-4">
            <ButtonLoading
              type="submit"
              isSubmitting={isSubmitting}
              submittingText="Adding..."
              className="bg-zinc-800 hover:bg-zinc-700">
              Add Address
            </ButtonLoading>
          </DialogFooter>
        </div>
      </Form>
    </DialogContent>
  );
}
