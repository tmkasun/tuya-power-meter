import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";

import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  DataZoomComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

export const defaultOptions: EChartsOption = {
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
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: {
    type: "line",
    smooth: true,
  },
} as EChartsOption;

echarts.use([
  TitleComponent,
  DatasetComponent,
  TooltipComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  ToolboxComponent,
]);
type EnergyLineChartProps = {
  options: EChartsOption;
  id: string;
};
const EnergyLineChart = (props: EnergyLineChartProps) => {
  const chartRefInst = useRef<HTMLDivElement | null>(null);
  const { id, options } = props;
  useEffect(() => {
    if (chartRefInst.current !== null) {
      const chart = echarts.getInstanceByDom(chartRefInst.current);
      chart?.setOption(options, true);
    }
  }, [options]);

  useEffect(() => {
    if (chartRefInst.current !== null) {
      const lineChart = echarts.init(chartRefInst.current);
      lineChart.setOption(options, true);
    }
  }, [options]);
  return (
    <div id={id} ref={chartRefInst} style={{ width: "100%", height: "80vh" }} />
  );
};

export default EnergyLineChart;
