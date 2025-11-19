"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const PieChart = (props: any) => {
  const { chartData, chartOptions } = props;
  return (
    <Chart
      type="pie"
      width="100%"
      height="100%"
      options={chartOptions}
      series={chartData}
    />
  );
};

export default PieChart;
