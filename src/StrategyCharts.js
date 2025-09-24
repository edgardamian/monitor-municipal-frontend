// src/StrategyCharts.js
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registramos los componentes de Chart.js que vamos a utilizar
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StrategyCharts = ({ indicators, color }) => {
  // Preparamos los datos para los gráficos
  const labels = indicators.map(ind => ind.indi_nom);
  const qualifications = indicators.map(ind => ind.indi_califica);
  const weights = indicators.map(ind => ind.indi_peso);

  // Datos para el gráfico de barras (Calificaciones)
  const barData = {
    labels,
    datasets: [
      {
        label: 'Calificación (0-100)',
        data: qualifications,
        backgroundColor: `${color.main}B3`, // Usamos el color del eje con transparencia
        borderColor: color.main,
        borderWidth: 1,
      },
    ],
  };

  // Opciones para el gráfico de barras
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Calificación por Indicador',
        font: { size: 16 }
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100 // La escala siempre será de 0 a 100
        }
    }
  };

  // Datos para el gráfico de dona (Pesos)
  const doughnutData = {
    labels,
    datasets: [
      {
        label: 'Peso (%)',
        data: weights,
        backgroundColor: [ // Generamos variaciones del color del eje
            `${color.main}E6`,
            `${color.light}E6`,
            `${color.main}99`,
            `${color.light}99`,
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };
  
  // Opciones para el gráfico de dona
  const doughnutOptions = {
      responsive: true,
      plugins: {
          legend: { 
              position: 'top',
          },
          title: {
              display: true,
              text: 'Distribución de Peso por Indicador',
              font: { size: 16 }
          }
      }
  }

  return (
    <div className="charts-section">
      <h3>Análisis Gráfico de Indicadores</h3>
      <div className="charts-container">
        <div className="chart-wrapper">
          <Bar options={barOptions} data={barData} />
        </div>
        <div className="chart-wrapper">
          <Doughnut options={doughnutOptions} data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default StrategyCharts;
