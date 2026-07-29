# Estado de los Proyectos (Historial y Pendientes)

Este documento sirve como "memoria a largo plazo" para que cualquier agente de IA o desarrollador sepa exactamente en qué estado quedó cada proyecto y qué falta por hacer al retomarlo.

## 1. Copiloto RRSS (`projects/rrss/copilotorrss/`)
**Estado Actual:** Funcional.
*   **Logros:**
    *   Integración de Llama 3 (Groq API) para "Sugerir Noticia Tech" y "Redactar Post" (con link a la landing inyectado por defecto).
    *   Generación de diseño gráfico dinámico exportable a PNG usando `html2canvas`.
    *   Integración de Pollinations AI para generar un fondo fotorealista basado en un *prompt* en inglés traducido por Groq en segundo plano.
    *   Lógica robusta (límite de 500 caracteres, pre-carga de imágenes y limpieza de caché mediante seed).
*   **Pendientes para el futuro:**
    *   Implementar la conexión oficial con la **API de Facebook Graph** usando el *Meta Page ID* y *Meta Access Token* para publicar directamente desde la plataforma (actualmente en modo simulación).

## 2. MediSync / Proyecto Tauro (`projects/tauro/`)
**Estado Actual:** Pausado con bugs conocidos.
*   **Logros:**
    *   Se implementó el inicio de sesión base con Firebase.
*   **Bugs Pendientes (URGENTE AL RETOMAR):**
    *   **Pantalla Blanca post-login:** Al intentar ingresar, el panel principal se muestra por 2 segundos y luego se va a una pantalla completamente blanca. Quedó pendiente de revisión exhaustiva de la lógica de enrutamiento/auth en el JS.

## 3. Landing Page Principal (Raíz)
**Estado Actual:** Estable.
*   **Logros:**
    *   El Intranet (`intranet.html`) está asegurado con Firebase. Se corrigieron los IDs y tipos del formulario de login.
    *   Diseños actualizados a "Mobile-First" (los marcos de teléfono solo aparecen en pantallas de escritorio).
