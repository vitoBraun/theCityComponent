import { useRef } from "react";
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
  opts?: RequestInit
): Promise<GeoResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(data);
    }, 500);
  });
}

type GeoHookReturn = {
  data: GeoResponse | null;
  isFetching: boolean;
  fetchFunc: () => Promise<void>;
};

export default function useGeoPoint({
  address,
}: {
  address: string;
}): GeoHookReturn {
  const isFetching = useRef(false);
  const response = useRef<GeoResponse | null>(null);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ addresses: address }),
  };
  const makeApiRequest = async () => {
    isFetching.current = true;
    const resp = await makeRequest(GESERVER_THECITY_API, options);
    isFetching.current = false;
    response.current = resp;
  };

  return {
    data: response.current,
    isFetching: isFetching.current,
    fetchFunc: makeApiRequest,
  };
}
