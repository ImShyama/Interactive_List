import React, { useContext, useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./InfoCard.css";
import linkContext from "../../context/links/linkContext";

const CityBarGraph = () => {
  const context = useContext(linkContext);
  const { clicks, fetchclicks } = context;
  const [topCities, setTopCities] = useState([]);

  useEffect(() => {
    fetchclicks();
  }, []);

  useEffect(() => {
    // Create a new array to store city counts
    const cityCounts = {};

    // Count occurrences of each city
    clicks.forEach((click) => {
      const city = click.city;
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });

    // Convert cityCounts object to an array of objects
    const cityCountArray = Object.keys(cityCounts).map((city) => ({
      city: city,
      count: cityCounts[city],
    }));

    // Sort cityCountArray based on count in descending order
    const sortedCityCountArray = cityCountArray.sort(
      (a, b) => b.count - a.count
    );

    // Select top 10 cities
    const top10Cities = sortedCityCountArray.slice(0, 10);

    setTopCities(top10Cities);
  }, [clicks]);

  const chartRef = useRef(null);
  const chartInstance = useRef();

  useEffect(() => {
    if (chartRef.current && topCities.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: topCities.map((cityData) => cityData.city),
            datasets: [
              {
                label: "City Count",
                data: topCities.map((cityData) => cityData.count),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(75, 192, 192, 0.2)",
                hoverBorderColor: "rgba(75, 192, 192, 1)",
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    var label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [topCities]);

  return <canvas ref={chartRef} />;
};

export default CityBarGraph;
