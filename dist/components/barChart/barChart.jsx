"use client";
import dynamic from "next/dynamic";
var Chart = dynamic(function () { return import("react-apexcharts"); }, {
    ssr: false,
});
var BarChart = function (_a) {
    var chartData = _a.chartData, chartOptions = _a.chartOptions;
    return (<Chart options={chartOptions} type="bar" width="100%" height="100%" series={chartData}/>);
};
export default BarChart;
