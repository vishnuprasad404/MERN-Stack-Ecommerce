import React from "react";
import './PieChart.css'
import { Pie } from "react-chartjs-2";
import {} from "chart.js/auto";

function PieChart({ data }) {
  // get orders status inventory //
  const Mobiles = data.filter((item) => {
    return item.category === "mobiles";
  });
  const Headphones = data.filter((item) => {
    return item.category === "headphones";
  });
  const Electronics = data.filter((item) => {
    return item.category === "electronics";
  });
  const Appliences = data.filter((item) => {
    return item.category === "appliences";
  });
  const Others = data.filter((item) => {
    return (
      item.category !== "mobiles" &&
      item.category !== "headphones" &&
      item.category !== "electronics" &&
      item.category !== "appliences"
    );
  });
  //end
  return (
    <div className="pie-chart">
      <Pie
        data={{
          labels: [
            "Mobiles",
            "Headphones",
            "Electronics",
            "Appliences",
            "Others",
          ],
          datasets: [
            {
              label: "Orders",
              data: [
                Mobiles.length,
                Headphones.length,
                Electronics.length,
                Appliences.length,
                Others.length,
              ],
              backgroundColor: [
                "#002C59",
                "#4297B6",
                "#E5323E",
                "#FF6633",
                "#848A9C",
              ],
            },
          ],
        }}
        height={300}
        width={600}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
}

export default PieChart;
