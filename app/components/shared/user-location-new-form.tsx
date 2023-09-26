import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { useActionData, useFetcher, useNavigation } from "@remix-run/react";

import type { action as actionAddNewUserLocation } from "~/routes/_user.checkout";
import {
  ButtonLoading,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  MapboxEmbed,
} from "~/components";
import type { AddressCoordinate } from "~/schemas";
import { defaultAddressCoordinate, schemaAddNewUserLocation } from "~/schemas";
import { useRootLoaderData } from "~/hooks";
import { useState } from "react";

export function AddNewUserLocationForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [coordinate, setCoordinate] = useState<AddressCoordinate>({
    longitude: defaultAddressCoordinate.longitude,
    latitude: defaultAddressCoordinate.latitude,
  });

  const handleChangeCoordinate = (newCoordinate: AddressCoordinate) => {
    setCoordinate(newCoordinate);
  };
  const fetcher = useFetcher();
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
        }
      : undefined,
  });

  return (
    <DialogContent className="max-w-7xl w-full">
      <DialogHeader>
        <DialogTitle>Add Address</DialogTitle>
        <DialogDescription>Add your shipping address</DialogDescription>
      </DialogHeader>
      <fetcher.Form
        method="POST"
        {...form.props}
        onSubmit={(event) => {
          fetcher.submit(event.currentTarget.form, {
            method: "POST",
          });
          setOpen(false);
        }}
        className="flex space-x-8">
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
        </div>

        <div className="space-y-1 w-1/2">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="latitude">Latitude</label>
            <Input
              {...conform.input(fields.latitude)}
              hidden
              type="number"
              name="latitude"
              value={coordinate.latitude}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="longitude">Longitude</label>
            <Input
              {...conform.input(fields.longitude)}
              hidden
              type="number"
              name="longitude"
              value={coordinate.longitude}
              readOnly
            />
          </div>
          <MapboxEmbed
            style={{ width: "100%", height: 300 }}
            zoom={12}
            draggable
            coordinateValue={coordinate}
            handleChangeCoordinate={handleChangeCoordinate}
          />

          <DialogFooter className="flex gap-x-4">
            <ButtonLoading
              type="submit"
              isSubmitting={isSubmitting}
              submittingText="Adding..."
              className="w-full bg-zinc-800 hover:bg-zinc-700">
              Add Address
            </ButtonLoading>
          </DialogFooter>
        </div>
      </fetcher.Form>
    </DialogContent>
  );
}
