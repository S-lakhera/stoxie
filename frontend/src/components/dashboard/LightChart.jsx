import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const LightChart = ({ data }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#000',
        textColor: '#fff',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
    });

    const lineSeries = chart.addLineSeries();
    lineSeries.setData(data);

    return () => chart.remove();
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default LightChart;
