// src/StrategyCharts.js
import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registramos solo lo necesario
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StrategyCharts = ({ indicators, color }) => {
  // Etiquetas y datos
  const labels = indicators.map((ind) => ind.indi_nom);
  const qualifications = indicators.map((ind) => ind.indi_califica);
  const weights = indicators.map((ind) => ind.indi_peso);

  // Datos del gráfico de barras
  const barData = {
    labels,
    datasets: [
      {
        label: "Calificación (0-100)",
        data: qualifications,
        backgroundColor: color.main,
      },
    ],
  };

  // Opciones del gráfico de barras
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // 🚀 hace que se adapte al contenedor
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Datos del gráfico de dona
  const doughnutData = {
    labels,
    datasets: [
      {
        data: weights,
        backgroundColor: [
          color.main,
          color.light,
          `${color.main}99`,
          `${color.light}99`,
        ],
      },
    ],
  };

  // Opciones del gráfico de dona
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="charts-section">
      <h3>Análisis Gráfico de Indicadores</h3>
      <div className="charts-container">
        <div className="chart-wrapper">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart-wrapper">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
};

export default StrategyCharts;
