"use client";

import { Suspense, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

export type GeoInfo = {
  countryName: string;
  countryCode: string;
  city: string;
};

export function UserCoordsInfo({ coord }: { coord: GeoInfo }) {
  return (
    <Suspense fallback={<div>idk my lil bros</div>}>
      {coord.countryName ? (
        <div>
          &bull;{" "}
          <span>
            Desde {coord.city}, {coord.countryName}{" "}
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
    </Suspense>
  );
}
