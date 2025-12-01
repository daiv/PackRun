import { useConnContext } from "@context";
import { useEffect, useState } from "react";

export function useStadiakey() {
  const [stadiaKey, setStadiaKey] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const { fetchData, isConnected } = useConnContext();

  useEffect(function getStadia() {
    if (isConnected && !stadiaKey)
      fetchData<{ stadiaApiKey: string } | null>('/api/stadia/', 'GET', null)
        .then(response => {
          if (response?.success) response.data?.stadiaApiKey && setStadiaKey(response.data.stadiaApiKey);
          else setError(response?.error);
        });
  }, [isConnected]);

  return { stadiaKey, error, isConnected };
}