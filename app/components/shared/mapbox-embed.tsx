import { useState } from "react";
import { MapPin } from "lucide-react";
import type { MarkerDragEvent, MapEvent } from "react-map-gl";
import type { UserLocation } from "@prisma/client";
import MapboxGL, {
  FullscreenControl,
  GeolocateControl,
  Marker as MapboxMarker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl";

import { useRootLoaderData } from "~/hooks";
import { defaultAddressCoordinate, type AddressCoordinate } from "~/schemas";

interface Props {
  address?: UserLocation;
  style?: {
    width: number | string;
    height: number | string;
  };
  zoom?: number;
  draggable?: boolean;

  coordinateValue?: AddressCoordinate;
  handleChangeCoordinate?: (arg0: AddressCoordinate) => void;
}

export function MapboxEmbed(props: Props) {
  const {
    address,
    style,
    zoom = 16,
    draggable,
    coordinateValue,
    handleChangeCoordinate,
  } = props;

  const { env } = useRootLoaderData();
  const [popupShown, setPopupShown] = useState(false);

  const mapboxAccessToken = env.MAPBOX_PUBLIC_TOKEN;
  const mapStyle = "mapbox://styles/mapbox/streets-v9";

  /**
   * Get initial coordinate from either:
   * 1. the form data changes (Map search API)
   * 2. or existing address data (Fujibox database)
   */
  const coordinate: AddressCoordinate = {
    longitude: coordinateValue?.longitude
      ? coordinateValue.longitude
      : address?.longitude
      ? Number(address?.longitude)
      : defaultAddressCoordinate.longitude,
    latitude: coordinateValue?.latitude
      ? coordinateValue.latitude
      : address?.latitude
      ? Number(address?.latitude)
      : defaultAddressCoordinate.latitude,
  };

  const initialViewState = { ...coordinate, zoom };

  const [markerPosition, setMarkerPosition] = useState(coordinate);

  const handleOnClick = (event: MapEvent) => {
    // event?.originalEvent?.stopPropagation();
    setPopupShown(true);
  };

  const handleOnDragStart = (event: MarkerDragEvent) => {
    console.info();
  };

  // Set the pointed coordinate in the Mapbox Embed UI
  const handleOnDrag = ({ lngLat }: MarkerDragEvent) => {
    const newCoordinate = { longitude: lngLat.lng, latitude: lngLat.lat };
    setMarkerPosition(newCoordinate);
  };

  // Send the pointed coordinate to the form
  const handleOnDragEnd = ({ lngLat }: MarkerDragEvent) => {
    const newCoordinate = { longitude: lngLat.lng, latitude: lngLat.lat };
    handleChangeCoordinate && handleChangeCoordinate(newCoordinate);
  };

  return (
    <div data-id="mapbox-embed">
      <MapboxGL
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        style={style ? style : { width: 800, height: 420 }}
        renderWorldCopies={false}>
        <FullscreenControl />
        <GeolocateControl trackUserLocation showAccuracyCircle={false} />
        <NavigationControl visualizePitch />
        <ScaleControl />

        <MapboxMarker
          anchor="bottom"
          longitude={markerPosition.longitude}
          latitude={markerPosition.latitude}
          draggable={draggable}
          onClick={handleOnClick as any}
          onDragStart={handleOnDragStart}
          onDrag={handleOnDrag}
          onDragEnd={handleOnDragEnd}>
          <MapPin className="h-10 w-10 cursor-pointer text-red-500" />
        </MapboxMarker>
        {address && popupShown && (
          <Popup
            anchor="top"
            onClose={() => setPopupShown(false)}
            longitude={coordinate.longitude}
            latitude={coordinate.latitude}
            closeButton={true}>
            <h4>{address.label}</h4>
            <p>{address.streetDetails}</p>
          </Popup>
        )}
      </MapboxGL>
    </div>
  );
}
