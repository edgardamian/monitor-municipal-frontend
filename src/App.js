// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import StrategyCharts from './StrategyCharts'; // <-- 1. Importamos el nuevo componente

// --- NUEVA PALETA DE COLORES DE ALTO CONTRASTE ---
// Seleccionada para mejorar la legibilidad y el atractivo visual.
const colorPalette = {
  'E1': { main: '#00796B', light: '#B2DFDB' }, // Verde Teal
  'E2': { main: '#1E88E5', light: '#BBDEFB' }, // Azul Vívido
  'E3': { main: '#388E3C', light: '#C8E6C9' }, // Verde Natural
  'E4': { main: '#5E35B1', light: '#D1C4E9' }, // Púrpura Profundo
  'E5': { main: '#455A64', light: '#CFD8DC' }, // Gris Azulado (Slate)
  'default': { main: '#6c757d', light: '#adb5bd' }
};

// --- Componentes auxiliares ---

const Loader = ({ text }) => <div className="loader">{text}</div>;

const WelcomePanel = () => (
  <div className="content-panel-welcome">
    <h2>Bienvenido al Tablero de Seguimiento</h2>
    <p>Seleccione un Eje y luego una Estrategia en el panel de la izquierda para explorar los detalles.</p>
  </div>
);

const EjeDetail = ({ eje }) => {
  if (!eje) return null;
  return (
    <div className="content-panel-body">
      <h2 className="content-title">{eje.eje_nom}</h2>
      <p className="eje-objetivo">{eje.eje_obj}</p>
      <div className="main-score-card">
        <div className="score-title">Calificación General del Eje</div>
        <div className="score-value">{Math.round(eje.calificacion_final_eje)}</div>
      </div>
      <p className="call-to-action">Por favor, seleccione una estrategia para ver más detalles.</p>
    </div>
  );
};

// --- 2. Modificamos EstrategiaDetail para recibir el color y mostrar los gráficos ---
const EstrategiaDetail = ({ loading, detalle, estrategia, color }) => {
  if (loading) return <Loader text="Cargando detalle..." />;
  
  const hasIndicators = detalle.indicadores && detalle.indicadores.length > 0;

  return (
    <div className="content-panel-body">
      <h2 className="content-title">{estrategia?.est_nom || 'Detalle'}</h2>
      <div className="detalle-grid">
        <div className="detalle-columna">
          <h3>Objetivos</h3>
          {detalle.objetivos.length > 0 ? (
            <ul>
              {detalle.objetivos.map(obj => <li key={obj.oe_cve}>{obj.oe_nombre}</li>)}
            </ul>
          ) : <p>No hay objetivos para esta estrategia.</p>}
        </div>
        <div className="detalle-columna">
          <h3>Indicadores</h3>
          {hasIndicators ? (
            <table className="detalle-table">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Meta</th>
                  <th>Peso</th>
                  <th>Calif.</th>
                </tr>
              </thead>
              <tbody>
                {detalle.indicadores.map(ind => (
                  <tr key={ind.indi_cve}>
                    <td>{ind.indi_nom}</td>
                    <td>{ind.indi_meta}</td>
                    <td>{ind.indi_peso}</td>
                    <td>{ind.indi_califica}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No hay indicadores para esta estrategia.</p>}
        </div>
      </div>

      {/* --- 3. Renderizamos el componente de gráficos si hay indicadores --- */}
      {hasIndicators && (
        <StrategyCharts indicators={detalle.indicadores} color={color} />
      )}
    </div>
  );
};

// --- Componente Principal de la Aplicación ---

function App() {
  const [ejes, setEjes] = useState([]);
  const [estrategias, setEstrategias] = useState({});
  const [detalle, setDetalle] = useState({ objetivos: [], indicadores: [] });

  const [selectedEje, setSelectedEje] = useState(null);
  const [selectedEstrategia, setSelectedEstrategia] = useState(null);
  
  const [loadingEstrategias, setLoadingEstrategias] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/ejes/calificaciones')
      .then(res => res.json())
      .then(data => setEjes(data))
      .catch(error => console.error("Error al cargar ejes:", error));
  }, []);

  const handleEjeClick = async (ejeCve) => {
    if (selectedEje === ejeCve && selectedEstrategia === null) return;
    
    setSelectedEje(ejeCve);
    setSelectedEstrategia(null);
    setDetalle({ objetivos: [], indicadores: [] });

    if (!estrategias[ejeCve]) {
      setLoadingEstrategias(true);
      try {
        const response = await fetch(`http://localhost:3000/api/estrategias/${ejeCve}`);
        const data = await response.json();
        setEstrategias(prev => ({ ...prev, [ejeCve]: data }));
      } catch (error) {
        console.error("Error al cargar estrategias:", error);
      }
      setLoadingEstrategias(false);
    }
  };

  const handleEstrategiaClick = async (estCve) => {
    setSelectedEstrategia(estCve);
    setLoadingDetalle(true);
    try {
      const response = await fetch(`http://localhost:3000/api/estrategia-detalle/${estCve}`);
      setDetalle(await response.json());
    } catch (error) {
      console.error("Error al cargar detalle de estrategia:", error);
    }
    setLoadingDetalle(false);
  };

  const currentEje = ejes.find(e => e.eje_cve === selectedEje);
  const currentEstrategias = estrategias[selectedEje] || [];
  const currentEstrategia = currentEstrategias.find(e => e.est_cve === selectedEstrategia);
  
  const color = selectedEje ? (colorPalette[selectedEje] || colorPalette.default) : colorPalette.default;
  
  const dynamicStyles = {
    '--eje-color-main': color.main,
    '--eje-color-light': color.light,
    '--content-panel-bg': selectedEje ? `${color.light}1A` : 'var(--content-bg-default)',
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <svg viewBox="0 0 100 80" width="25" height="25">
            <rect width="100" height="15" rx="8"></rect>
            <rect y="30" width="100" height="15" rx="8"></rect>
            <rect y="60" width="100" height="15" rx="8"></rect>
          </svg>
        </button>
        <h1>
          SEGUIMIENTO Y EVALUACIÓN AL <br /> PROGRAMA MUNICIPAL DE DESARROLLO URBANO
        </h1>
      </header>
      <div className={`dashboard-layout ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`} style={dynamicStyles}>
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <h2>Ejes Estratégicos</h2>
            <ul>
              {ejes.map(eje => (
                <li key={eje.eje_cve} className={selectedEje === eje.eje_cve ? 'eje-item-selected' : ''}>
                  <div className="eje-item" onClick={() => handleEjeClick(eje.eje_cve)}>
                    <span>{eje.eje_nom}</span>
                    <span className="nav-score">{Math.round(eje.calificacion_final_eje)}</span>
                  </div>
                  {selectedEje === eje.eje_cve && (
                    <ul className="estrategia-submenu">
                      {loadingEstrategias ? <Loader text="Cargando..." /> : 
                        currentEstrategias.map(est => (
                          <li 
                            key={est.est_cve}
                            className={selectedEstrategia === est.est_cve ? 'estrategia-item-selected' : ''}
                            onClick={() => handleEstrategiaClick(est.est_cve)}
                          >
                            {est.est_nom}
                          </li>
                        ))
                      }
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="content-panel">
          {!selectedEje && <WelcomePanel />}
          {selectedEje && !selectedEstrategia && <EjeDetail eje={currentEje} />}
          {/* --- 4. Pasamos el color al componente EstrategiaDetail --- */}
          {selectedEstrategia && <EstrategiaDetail loading={loadingDetalle} detalle={detalle} estrategia={currentEstrategia} color={color} />}
        </main>
      </div>
    </div>
  );
}

export default App;

