"use client";

import { Suspense, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

export type GeoInfo = {
  countryName: string;
  countryCode: string;
  locality: string;
  city: string;
};

export function UserCoordsInfo({
  coord,
  error,
}: {
  coord: GeoInfo;
  error: GeolocationPositionError | null;
}) {
  return (
    <Suspense fallback={<div>idk my lil bros</div>}>
      {error?.message ? (
        <span className="text-red-500 text-sm">
          No se pudo obtener tu ubicación
        </span>
      ) : (
        <>
          {coord.countryName ? (
            <div>
              &bull;{" "}
              <span className="text-sm">
                Desde {coord.locality} - {coord.city}, {coord.countryName}{" "}
                <ReactCountryFlag
                  svg
                  className="w-5 h-5"
                  aria-label="country flag"
                  title="country flag"
                  countryCode={coord.countryCode}
                />
              </span>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </Suspense>
  );
}
