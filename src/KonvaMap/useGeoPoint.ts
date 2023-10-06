import { useState } from "react";
import { GeoResponse } from "./types";
import { data } from "./mock";
const GEOSERVER_THECITY_API = "https://geo.emg24.ru/api/thecity";

// async function makeRequest<T = GeoResponse>(
//   url: string,
//   opts?: RequestInit
// ): Promise<T> {
//   const resp = await fetch(url, {
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
  opts?: RequestInit
): Promise<GeoResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(data);
    }, 2000);
  });
}

type GeoHookReturn = {
  isFetching: boolean;
  fetchGeoPoint: () => Promise<GeoResponse | null>;
};

export default function useGeoPoint(address: string): GeoHookReturn {
  const [isFetching, setIsFetching] = useState(false);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  };
  const makeApiRequest = async () => {
    try {
      setIsFetching(true);
      const resp = await makeRequest(GEOSERVER_THECITY_API, options);
      setIsFetching(false);
      return resp;
    } catch (error) {
      setIsFetching(false);
      return null;
    }
  };

  return {
    isFetching,
    fetchGeoPoint: makeApiRequest,
  };
}
