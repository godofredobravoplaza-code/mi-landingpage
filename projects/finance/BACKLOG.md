# Backlog de Phenix Finance

Este archivo contiene las ideas y futuras funcionalidades que se planean agregar a la aplicación en un futuro, cuando se retome el desarrollo.

## Ideas Pendientes (Julio 2026)

1. **Dashboard Visual e Insights:**
   - Agregar gráficos (circulares, barras) para mostrar visualmente la proporción del total que se va en "Comisiones e Intereses" vs "Compras Reales".
   - Análisis de tendencias de gastos a lo largo del tiempo (mes a mes).

2. **Pruebas y Soporte para Nuevos Bancos:**
   - Realizar pruebas de carga con cartolas reales de **Banco Falabella** y **Tenpo**.
   - Ajustar el motor de parseo y expresiones regulares en `app.js` según las palabras clave específicas de esos bancos, asegurando que los pagos/abonos se ignoren correctamente y los cargos se sumen de forma perfecta, tal como se hizo con Banco de Chile y Banco Estado.

3. **Módulo de Ingresos y Alertas de Salud Financiera:**
   - Interfaz para que el usuario ingrese su sueldo/ingreso mensual.
   - Sistema de alertas (ej. alerta roja) si las deudas consolidadas proyectadas para el mes superan un porcentaje crítico (ej. 50%) de los ingresos.
   
4. **Exportación de Reportes:**
   - Capacidad de exportar el estado consolidado a PDF para tener un respaldo o enviar por correo.
