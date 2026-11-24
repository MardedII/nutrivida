import React, { useState, useCallback } from 'react';
import { useCatalogo } from '../utils/useDatos';
import { Link } from 'react-router-dom';
import Map from '../component/Map';

export default function Inicio() {
    const [error,setError]=useState('');
    const [cargando,setCargando]=useState(true);
    const fallo=useCallback(mensaje=>{setError(mensaje);setCargando(false);},[]);
    const cargado=useCallback(()=>{setError('');setCargando(false);},[]);
    const profesionales=useCatalogo(fallo,cargado);
    return (
        <>
            <header className="hero-section text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold">Clínica Nutricional NutriVida</h1>
                    <p className="lead">Atención experta y planes personalizados en Temuco.</p>
                    <Link to="/agendar" className="btn btn-nutri btn-lg mt-3">Agendar Cita</Link>
                </div>
            </header>

            <main className="container my-5">
                <h2 className="text-center text-nutri mb-4">Especialidades Médicas</h2>
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card-custom p-4 text-center h-100">
                            <img src="/img/control_peso.jpg" alt="Control de Peso" className="img-fluid mb-3 rounded mx-auto d-block" style={{ maxHeight: '160px', objectFit: 'cover' }} />
                            <h4 className="text-nutri">Control de Peso</h4>
                            <p>Reducción de grasa corporal mediante hábitos sostenibles sin dietas restrictivas.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-custom p-4 text-center h-100">
                            <img src="/img/metabo.jpg" alt="Salud Metabólica" className="img-fluid mb-3 rounded mx-auto d-block" style={{ maxHeight: '160px', objectFit: 'cover' }} />
                            <h4 className="text-nutri">Salud Metabólica</h4>
                            <p>Manejo de resistencia a la insulina, diabetes, hipertensión y dislipidemias.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-custom p-4 text-center h-100">
                            <img src="/img/derpo.jpg" alt="Nutrición Deportiva" className="img-fluid mb-3 rounded mx-auto d-block" style={{ maxHeight: '160px', objectFit: 'cover' }} />
                            <h4 className="text-nutri">Nutrición Deportiva</h4>
                            <p>Optimización del rendimiento, ganancia de masa muscular y recuperación atleta.</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-center text-nutri mb-4">Nuestros Nutricionistas</h2>
                {error && <div className="alert alert-warning">No se pudo cargar el catálogo: {error}</div>}
                <div className="row g-4">
                    {cargando && <p role="status" className="text-muted">Cargando nutricionistas…</p>}
                    {!cargando && !error && profesionales.length===0 && <p className="text-muted">No hay profesionales disponibles.</p>}
                    {profesionales.map(p=><div className="col-md-3" key={p.id}><div className="card-custom p-3 text-center h-100"><img src={p.imagen || '/img/perfil-generico.svg'} onError={e=>{const alternativa='/img/perfil-generico.svg';if(e.currentTarget.getAttribute('src')!==alternativa)e.currentTarget.src=alternativa;}} alt={p.nombre} className="avatar-doctor mb-3 mx-auto d-block"/><h5>{p.nombre}</h5><p className="text-nutri fw-bold mb-1">{p.especialidad}</p></div></div>)}
                </div>

                <hr className="my-5" />

                <h2 id="ubicacion" className="text-center text-nutri mb-4">Ubicación de la Clínica</h2>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <p><strong>Dirección:</strong> Av. Alemania #0855, Temuco, Región de La Araucanía.</p>
                        <p><strong>Teléfono:</strong> +56 45 2 123456</p>
                        <p><strong>Atención:</strong> Lunes a Viernes de 09:00 a 18:00 hrs.</p>
                    </div>
                    <div className="col-md-6">
                        <Map />
                    </div>
                </div>
            </main>
        </>
    );
}