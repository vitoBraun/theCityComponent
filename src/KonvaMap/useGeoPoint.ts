import { useState } from "react";
import { GeoResponse } from "./types";
import { data } from "./mock";
const GESERVER_THECITY_API = "https://geo.emg24.ru/api/thecity";

// async function makeRequest<T = GeoResponse>(
//   url: string,
//   opts?: RequestInit
// ): Promise<T> {
//   const resp = await fetch(window.location.origin + url, {
//     credentials: "include",
//     ...opts,
//   });
//   if (resp.ok) {
//     return resp.json();
//   } else {
//     const message = await resp.text();
//     throw new Error(message);
//   }
// }

async function makeRequest(
  url: string,
  opts?: RequestInit,
): Promise<GeoResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(data);
    }, 500);
  });
}

type GeoHookReturn = {
  isFetching: boolean;
  fetchGeoPoint: () => Promise<GeoResponse>;
};

export default function useGeoPoint(address: string): GeoHookReturn {
  const [isFetching, setIsFetching] = useState(false);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ addresses: address }),
  };
  const makeApiRequest = async () => {
    setIsFetching(true);
    const resp = await makeRequest(GESERVER_THECITY_API, options);
    setIsFetching(false);

    return resp;
  };

  return {
    isFetching,
    fetchGeoPoint: makeApiRequest,
  };
}
