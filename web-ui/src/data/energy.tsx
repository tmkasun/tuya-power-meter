import React, { useEffect, useState } from "react";
import Configs from "../configs/configs";

type EnergyRecord = {
  power: number;
  isOn: number;
  time: string;
  voltage: number;
};

const apiEndpoint = Configs.API_BASE_PATH + "/energy";

export const useEnergyData = () => {
  const [data, setData] = useState<EnergyRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const mutate = async (from: any, to: any) => {
    setLoading(true);
    let response;
    const fromDate = from.format("YYYY-MM-DD");
    const toDate = to.format("YYYY-MM-DD");
    const searchQuery = `${apiEndpoint}?limit=-1&start=${fromDate}&end=${toDate}&order=ASC`;
    try {
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful
      response = await fetch(searchQuery);
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const data = await response?.json();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      let response;
      try {
        response = await fetch(apiEndpoint);
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_that_the_fetch_was_successful

        if (!response.ok) {
          let errorStatusText,
            errorCode,
            errorBody,
            errorMessage = "";
          const { statusText, status } = response as any;
          if (statusText) {
            errorStatusText = statusText;
            errorMessage += `${statusText} |`;
          }
          if (status) {
            errorCode = status;
          }
          errorBody = await response.text();
          try {
            const parsedJson = JSON.parse(errorBody);
            if (
              parsedJson.message?.toLowerCase() !==
              errorStatusText.toLowerCase()
            ) {
              errorMessage += ` ${parsedJson.message} |`;
            }
          } catch (error) {
            console.error("Error while parsing error body", error);
          }
          const handledError = new Error();
          if (errorMessage.trim().endsWith("|")) {
            errorMessage = errorMessage.slice(0, -1).trim();
          }
          handledError.message = errorMessage;
          handledError.name = `Network error [${errorCode}]`;
          throw handledError;
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
      if (!response?.bodyUsed) {
        const data = await response?.json();
        setData(data);
      }
    })();
  }, []);
  return { data, loading, error, mutate };
};
