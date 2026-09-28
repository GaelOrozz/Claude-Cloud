# Analíticas de Instagram

Dashboard estilo "bento" (React + Tailwind) con datos de ejemplo para dos cuentas: **Principal** y **Kyros**.

| Archivo | Para qué sirve |
|---|---|
| `InstagramDashboard.jsx` | Componente único de React + Tailwind (export default). Pégalo en un proyecto Vite/Next con Tailwind 3. |
| `index.html` | Versión compilada y autónoma. Ábrela en el navegador; carga React desde cdnjs. |

## Qué incluye

- Selector de cuenta en forma de píldora. Al cambiar de cuenta se actualizan todas las métricas.
- Tarjeta oscura de resumen: visualizaciones totales, seguidores netos, interacciones, crecimiento, alcance y engagement.
- Hitos del mes con día récord, meta de seguidores y notas de campaña (se guardan en `localStorage` del navegador).
- Rendimiento de las 4 publicaciones recientes, que puedes ordenar por fecha o por visualizaciones.
- Público: género y países/ciudades principales con barras finas.
- Gráfica spline de interacciones (diaria o mensual) con tooltip al pasar el cursor o con las flechas del teclado.
- Botón **Editar** para cambiar el titular, el resumen y la meta de seguidores, y **Ajustes** para cambiar el formato de números o ocultar la comparación con el mes anterior.

## Conectar datos reales

Todos los datos están en la constante `ACCOUNTS` al inicio de `InstagramDashboard.jsx`. Para usar tus métricas reales, reemplázala por la respuesta de tu backend respetando la misma forma:

1. Convierte tus cuentas a **Profesional** (Creador o Empresa) en Instagram.
2. Crea una app en [developers.facebook.com](https://developers.facebook.com) con la **Instagram API** y pide los permisos `instagram_business_basic` y `instagram_business_manage_insights`.
3. Crea un backend pequeño (por ejemplo, una función serverless en Vercel o Netlify) que guarde el token de acceso y llame a los endpoints `/{ig-user-id}/insights` y `/{ig-user-id}/media`.
4. En el componente, haz `fetch` a tu backend y transforma la respuesta al formato de `ACCOUNTS`.

El token nunca debe ir en el código del frontend.
