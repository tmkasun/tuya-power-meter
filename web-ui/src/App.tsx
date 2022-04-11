import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useEnergyData } from "./data/energy";
import LineChart from "./components/LineChart";
import { EChartsOption } from "echarts";
import EnergyDatePicker from "./components/DatePicker";
import { CircularProgress, Box, Alert, AlertTitle } from "@mui/material";

function App() {
  const { data, loading: isDataLoading, error, mutate } = useEnergyData();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);

  useEffect(() => {
    if (fromDate && toDate) {
      mutate(fromDate, toDate);
    }
  }, [fromDate, toDate]);
  const [options, setOptions] = useState<EChartsOption | null>(null);
  useEffect(() => {
    if (!data) {
      return;
    }

    const xAxisTime = [];
    const yAxisPower = [];
    for (const record of data) {
      xAxisTime.push(record.time);
      yAxisPower.push(record.power);
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
      <Box mt={5} display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" justifyContent="center">
          <EnergyDatePicker
            value={fromDate}
            setValue={setFromDate}
            label="from"
          />
          <EnergyDatePicker value={toDate} setValue={setToDate} label="to" />
        </Box>
        <Box mt={5} display="flex" justifyContent="center" alignItems="center">
          {isDataLoading && <CircularProgress />}
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
        </Box>
      </Box>
    </div>
  );
}

export default App;
