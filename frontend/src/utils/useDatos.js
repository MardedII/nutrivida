import { useState, useEffect, useCallback } from 'react';
import { citasApi, catalogo } from '../services/api';
export function normalizarCita(c) { return {...c, fecha:c.inicio?.slice(0,10), hora:c.inicio?.slice(11,16), propuestaReprogramacion:c.propuestaReprogramacion?.fecha ? {...c.propuestaReprogramacion,hora:c.propuestaReprogramacion.hora?.slice(0,5)} : null}; }
export function useDatos(cargar, error, normalizar = identidad, alCargar) {
 const [datos,setDatos]=useState([]);
 const refrescar=useCallback(async()=>{try { const d=await cargar();setDatos(d.map(normalizar)); alCargar?.(); }catch(e){error(e.message||'No se pudo conectar al backend');}},[cargar,error,normalizar,alCargar]);
 useEffect(()=>{refrescar();const timer=setInterval(refrescar,10000);window.addEventListener('focus',refrescar);return()=>{clearInterval(timer);window.removeEventListener('focus',refrescar);};},[refrescar]);
 return [datos,setDatos,refrescar];
}
const identidad=x=>x;
export function useCitas(error){return useDatos(citasApi.listar,error,normalizarCita);}
export function useCatalogo(error,alCargar){return useDatos(catalogo,error,identidad,alCargar)[0];}
export const HORARIOS=Array.from({length:9},(_,i)=>String(i+9).padStart(2,'0')+':00');
export const inicioCita=(fecha,hora)=>`${fecha}T${hora}:00`;
export function horarioValido(fecha,hora){const d=new Date(inicioCita(fecha,hora));return HORARIOS.includes(hora)&&!isNaN(d)&&d>new Date()&&![0,6].includes(d.getDay());}
export function useOcupados(id,fecha,error){const [horas,setHoras]=useState([]);useEffect(()=>{let vigente=true;setHoras([]);if(id&&fecha)citasApi.ocupados(id,fecha).then(d=>{if(vigente)setHoras(d);}).catch(e=>{if(vigente)error(e.message);});return()=>{vigente=false;};},[id,fecha,error]);return horas;}
