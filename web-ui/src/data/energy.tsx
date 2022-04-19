import React, { useEffect, useState } from "react";
import { EnergyParameterTypes } from "../components/EnergyParameters";
import Configs from "../configs/configs";

type EnergyRecordx = {
  [key in EnergyParameterTypes]: number;
};

interface EnergyRecord extends EnergyRecordx {
  time: string;
}

const getAPIEndpoint = (parameterType: EnergyParameterTypes) => {
  let apiEndpoint = Configs.API_BASE_PATH;
  switch (parameterType) {
    case EnergyParameterTypes.Power:
      apiEndpoint += "/energy";
      break;
    case EnergyParameterTypes.Voltage:
      apiEndpoint += "/energy/voltage";
      break;

    case EnergyParameterTypes.TotalEnergy:
      apiEndpoint += "/energy/total";
      break;

    default:
      console.error("Unknown parameter type");
      break;
  }
  return apiEndpoint;
};

export const useEnergyData = () => {
  const [data, setData] = useState<EnergyRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const mutate = async (
    parameterType: EnergyParameterTypes,
    from?: any,
    to?: any
  ) => {
    let response,
      searchQuery = "";
    if (from && to) {
      const fromDate = from.format("YYYY-MM-DD");
      const toDate = to.format("YYYY-MM-DD");
      searchQuery = `?limit=-1&start=${fromDate}&end=${toDate}&order=ASC`;
    }
    try {
      const apiEndpoint = getAPIEndpoint(parameterType);
      response = await fetch(apiEndpoint + searchQuery);
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
            parsedJson.message?.toLowerCase() !== errorStatusText.toLowerCase()
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
  };

  useEffect(() => {
    mutate(EnergyParameterTypes.Power);
  }, []);
  return { data, loading, error, mutate };
};
