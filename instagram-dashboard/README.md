# Analíticas de Instagram

Dashboard estilo "bento" (React + Tailwind) que muestra tus analíticas de Instagram en vivo cuando se abre en claude.ai con los conectores activos, y datos de ejemplo en cualquier otro lugar.

| Archivo | Para qué sirve |
|---|---|
| `InstagramDashboard.jsx` | Componente único de React + Tailwind (export default). Pégalo en un proyecto Vite/Next con Tailwind 3. |
| `index.html` | Versión compilada y autónoma. Carga React desde cdnjs. Fuera de claude.ai muestra datos de ejemplo. |

## De dónde salen los datos

La página usa la capability `mcp` de los artefactos de claude.ai, que llama a tus conectores con tus propias credenciales. La página no guarda nada de lo que lee.

- **Instagram → conector Composio.**
  - `COMPOSIO_MANAGE_CONNECTIONS` (solo `action: "list"`) descubre las cuentas de Instagram conectadas. Cada una aparece como una pestaña con el alias que le pusiste en Composio (por ejemplo, "Personal" y "Kyros").
  - Una llamada a `COMPOSIO_MULTI_EXECUTE_TOOL` ejecuta en paralelo, para cada cuenta:
    - `INSTAGRAM_GET_USER_INFO`: seguidores y número de publicaciones.
    - `INSTAGRAM_GET_IG_USER_MEDIA` e `INSTAGRAM_GET_IG_USER_STORIES`: publicaciones del feed e historias activas.
    - `INSTAGRAM_GET_USER_INSIGHTS`: totales de los últimos 30 días y de los 30 anteriores, desglose por tipo de contenido, seguidores ganados y perdidos, alcance diario y demografía.
  - Una segunda llamada trae `INSTAGRAM_GET_IG_MEDIA_INSIGHTS` de los 6 posts más recientes y de las historias activas de cada cuenta, porque el listado de posts no incluye las vistas.
- **TikTok → conector Metricool** (`getBrandSettings` y `getAnalyticsDataByMetrics`). Solo se consulta si ya diste permiso a Metricool o si pulsas "Cargar desde Metricool".

Si un conector falla, cada sección muestra qué pasó y cómo arreglarlo (reconectar, agregar el conector o reintentar), y el resto del panel sigue funcionando.

## Qué incluye

- Selector de cuenta en forma de píldora. Las cuentas no conectadas (por ahora Kyros) se marcan como "ejemplo".
- Tarjeta de resumen con contraste invertido: visualizaciones, seguidores netos, alcance, interacciones, visitas al perfil y engagement, con su cambio contra los 30 días anteriores.
- Hitos con día de más alcance, meta de seguidores y notas de campaña (se guardan en `localStorage`).
- Rendimiento de contenido: publicaciones del feed o, si no hay, tus historias activas con vistas y alcance.
- Público: género, edad, países y ciudades.
- Gráfica spline del alcance diario (30 o 60 días) con tooltip por cursor o teclado.
- Tema claro/oscuro, modo **Editar** y **Ajustes** de formato.
- Recomendaciones: consejos calculados con tus datos, más tendencias, viralidad, hooks y engagement investigados en septiembre de 2026, con fuentes.
