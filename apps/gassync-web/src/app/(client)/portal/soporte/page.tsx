'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ----------------------------------------------------------------------
// PÁGINA: Soporte al Cliente
// ----------------------------------------------------------------------
// Centro de ayuda, FAQs y formulario de contacto.
// ----------------------------------------------------------------------

export default function SoportePage() {
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Centro de Soporte</h2>
          <p className="text-slate-500 mt-1">Resolvemos tus dudas sobre el proceso de certificación.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Columna Izquierda: Formulario */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                <i className="fa-solid fa-headset text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Crear un Ticket</h3>
                <p className="text-sm text-slate-500">Te responderemos en menos de 24 horas hábiles.</p>
              </div>
            </div>

            {ticketSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-[fadeIn_0.5s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <i className="fa-solid fa-check text-2xl"></i>
                </div>
                <h4 className="font-bold text-emerald-800 text-lg mb-2">Mensaje Enviado</h4>
                <p className="text-sm text-emerald-600 mb-6">Hemos recibido tu consulta. Nuestro equipo de soporte te contactará pronto.</p>
                <button onClick={() => setTicketSent(false)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Motivo de Consulta</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-sky-500 transition-colors">
                    <option>Duda sobre mi Sello Rojo/Amarillo</option>
                    <option>Problema con el agendamiento</option>
                    <option>Facturación y Cobranza</option>
                    <option>Otra consulta técnica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tu Mensaje</label>
                  <textarea 
                    rows={5} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-sky-500 transition-colors resize-none" 
                    placeholder="Describe en detalle cómo podemos ayudarte..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-colors flex justify-center items-center gap-2">
                  <i className="fa-solid fa-paper-plane"></i> Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Columna Derecha: FAQs */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Preguntas Frecuentes (FAQ)</h3>
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 transition-colors cursor-pointer group">
            <h4 className="font-bold text-slate-800 flex justify-between items-center group-hover:text-sky-600">
              ¿Qué pasa si repruebo la inspección?
              <i className="fa-solid fa-chevron-down text-slate-400 group-hover:text-sky-500"></i>
            </h4>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Obtendrás Sello Rojo o Amarillo dependiendo de la gravedad. Tendrás que contratar a un instalador SEC externo para arreglar los defectos y luego solicitar una re-inspección a través de este portal.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 transition-colors cursor-pointer group">
            <h4 className="font-bold text-slate-800 flex justify-between items-center group-hover:text-sky-600">
              ¿Debo estar presente durante la inspección?
              <i className="fa-solid fa-chevron-down text-slate-400 group-hover:text-sky-500"></i>
            </h4>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Sí, un residente mayor de edad debe estar presente en el domicilio para permitir el ingreso del inspector y firmar el acta de conformidad.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 transition-colors cursor-pointer group">
            <h4 className="font-bold text-slate-800 flex justify-between items-center group-hover:text-sky-600">
              ¿Cuánto demora el proceso en la SEC?
              <i className="fa-solid fa-chevron-down text-slate-400 group-hover:text-sky-500"></i>
            </h4>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Una vez que emitimos el informe TC6, la Superintendencia de Electricidad y Combustibles (SEC) toma alrededor de 15 días hábiles en oficializar tu Sello Verde.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
