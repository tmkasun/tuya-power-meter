import React, { useEffect, useState } from "react";
import "./App.css";
import { useEnergyData } from "./data/energy";
import LineChart from "./components/LineChart";
import { EChartsOption } from "echarts";
import EnergyDatePicker from "./components/DatePicker";
import { CircularProgress, Box, Alert, AlertTitle } from "@mui/material";
import Footer from "./components/Footer";
import EnergyParameters, {
  EnergyParameterTypes,
} from "./components/EnergyParameters";

type WhileLoadingProps = {
  isLoading: boolean;
};
const WhileLoading: React.FC<WhileLoadingProps> = ({ isLoading, children }) => {
  return <>{isLoading ? <CircularProgress /> : children}</>;
};

function App() {
  const { data, loading: isDataLoading, error, mutate } = useEnergyData();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);

  const [currentParameterType, setCurrentParameterType] = React.useState(
    EnergyParameterTypes.Power
  );

  const handleParameterTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setCurrentParameterType(newAlignment as EnergyParameterTypes);
  };

  useEffect(() => {
    if (fromDate && toDate) {
      mutate(currentParameterType, fromDate, toDate);
    } else {
      mutate(currentParameterType);
    }
  }, [fromDate, toDate, currentParameterType]);

  const [options, setOptions] = useState<EChartsOption | null>(null);
  useEffect(() => {
    if (!data) {
      return;
    }

    const xAxisTime = [];
    const yAxisPower = [];
    const firstRecord = data[0][currentParameterType] as number;
    for (const record of data) {
      xAxisTime.push(new Date(record.time + "+00:00").toLocaleTimeString());
      if (currentParameterType === EnergyParameterTypes.TotalEnergy) {
        // to get relative total energy change
        yAxisPower.push(
          ((record[currentParameterType]) as number - firstRecord) / 100
        );
      } else {
        yAxisPower.push((record[currentParameterType] as number) / 10);
      }
    }
    // use LineChart default ops
    let opts = {
      title: {},
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 10,
          handleSize: "10%",
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: xAxisTime,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: {
        data: yAxisPower,
        type: "line",
        smooth: true,
      },
    } as EChartsOption;
    setOptions(opts);
  }, [data]);
  let errorName, errorMessage;
  if (error) {
    const { name, message } = error as Error;
    errorName = name;
    errorMessage = message;
  }

  return (
    <div className="App">
      <Box mt={5} display="flex" flexGrow={1} flexDirection="column">
        <Box display="flex" flexDirection="row" justifyContent="center">
          <EnergyDatePicker
            mr={2}
            value={fromDate}
            setValue={setFromDate}
            label="from"
          />
          <EnergyDatePicker value={toDate} setValue={setToDate} label="to" />
          <EnergyParameters
            parameters={[
              EnergyParameterTypes.Power,
              EnergyParameterTypes.Voltage,
              EnergyParameterTypes.TotalEnergy,
            ]}
            selected={currentParameterType}
            onChange={handleParameterTypeChange}
          />
        </Box>
        <Box mt={5} display="flex" justifyContent="center" alignItems="center">
          <WhileLoading isLoading={isDataLoading}>
            {options && <LineChart id="foo" options={options} />}
            {error && (
              <Alert sx={{ width: 0.8 }} severity="error">
                <AlertTitle
                  sx={{
                    textAlign: "left",
                  }}
                >
                  {errorName}
                </AlertTitle>
                {errorMessage}
              </Alert>
            )}
          </WhileLoading>
        </Box>
      </Box>
      <Footer />
    </div>
  );
}

export default App;
