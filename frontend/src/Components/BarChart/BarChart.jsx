import React from "react";
import "./BarChart.css";
import { Bar } from "react-chartjs-2";
import {} from "chart.js/auto";

function BarChart({ data }) {
    // get orders status inventory //
    const PendingOrders = data.filter((item) => {
      return item.status === "placed";
    });
    const ProcessingOrders = data.filter((item) => {
      return item.status === "dispatched";
    });
    const CompletedOrders = data.filter((item) => {
      return item.status === "completed";
    });
    const CancelledOrders = data.filter((item) => {
      return item.status === "cancelled";
    });
  
    //end
  return (
    <div className="bar-chart-container">
      <Bar
        data={{
          labels: ["Pending", "Processing", "Completed", "Cancelled"],
          datasets: [
            {
              label: "Orders",
              data: [
                PendingOrders.length,
                ProcessingOrders.length,
                CompletedOrders.length,
                CancelledOrders.length,
              ],
              backgroundColor: [
                "rgba(255, 196, 0, 0.363)",
                "rgba(157, 255, 0, 0.233)",
                "rgba(0, 255, 64, 0.363)",
                "rgba(255, 8, 0, 0.233)",
              ],
              borderColor: [
                "rgb(255, 174, 24)",
                "rgba(193, 255, 24, 0.733)",
                "rgba(24, 255, 24, 0.733)",
                "rgba(255, 59, 24, 0.384)",
              ],
              borderWidth: 1,
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

export default BarChart;
