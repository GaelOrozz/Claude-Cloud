import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Datos de ejemplo. Se usan mientras no hay conexión en vivo (por    */
/*  ejemplo, fuera de claude.ai) y para cuentas no conectadas.         */
/* ------------------------------------------------------------------ */

const PERIOD = { label: "Agosto 2026", month: "agosto", prevMonth: "julio", short: "ago", year: 2026, monthIndex: 7, days: 31 };
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago"];
const MONTHS_LONG = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto"];
const WEEKDAYS = ["domingos", "lunes", "martes", "miércoles", "jueves", "viernes", "sábados"];
const TONES = [
  "linear-gradient(135deg,#3A3A3C,#1C1C1E)",
  "linear-gradient(135deg,#AEAEB2,#636366)",
  "linear-gradient(135deg,#C7C7CC,#8E8E93)",
  "linear-gradient(135deg,#8E8E93,#3A3A3C)",
];

const SAMPLE_ACCOUNTS = [
  {
    id: "principal",
    name: "Principal",
    handle: "@aramorozz",
    initial: "P",
    views: 1842300,
    viewsPrev: 1493000,
    reach: 612400,
    reachPrev: 540100,
    interactions: 126480,
    interactionsPrev: 104200,
    followersStart: 48210,
    followersEnd: 53022,
    milestone: {
      title: "¡Agosto fue un mes fantástico!",
      body: "Tu mejor mes del año: las visualizaciones crecieron 23.4% y sumaste 4,812 seguidores. El reel del 26 de agosto marcó tu récord de interacciones.",
      goal: 55000,
    },
    seedNotes: [
      { id: "p-1", text: "Campaña #VeranoCreativo: 3 reels patrocinados, cerró el 21 ago.", date: "21 ago 2026" },
    ],
    posts: [
      { id: "p1", title: "Detrás de cámaras: rodaje en CDMX", type: "reel", day: 26, views: 412800, likes: 28400 },
      { id: "p2", title: "5 errores al editar tus reels", type: "carrusel", day: 21, views: 186200, likes: 14100 },
      { id: "p3", title: "Atardecer en Valle de Bravo", type: "foto", day: 17, views: 94600, likes: 9800 },
      { id: "p4", title: "Mi setup de edición 2026", type: "reel", day: 12, views: 268900, likes: 19300 },
    ],
    gender: [
      { label: "Mujeres", value: 58.4 },
      { label: "Hombres", value: 41.6 },
    ],
    countries: [
      { code: "MX", label: "México", value: 62.3 },
      { code: "US", label: "Estados Unidos", value: 11.8 },
      { code: "ES", label: "España", value: 7.4 },
      { code: "CO", label: "Colombia", value: 6.1 },
      { code: "AR", label: "Argentina", value: 4.2 },
    ],
    cities: [
      { label: "Ciudad de México", value: 28.6 },
      { label: "Guadalajara", value: 9.4 },
      { label: "Monterrey", value: 7.9 },
      { label: "Puebla", value: 3.8 },
      { label: "Los Ángeles", value: 3.1 },
    ],
    // Interacciones diarias del 1 al 31 de agosto (suman 126,480)
    daily: [2728, 3221, 2383, 2657, 2937, 2894, 2845, 3462, 3517, 2776, 3201, 5481, 4373, 3488, 3615, 3866, 5346, 4144, 4011, 3507, 6481, 5526, 4318, 3346, 4010, 8812, 6102, 4416, 4704, 4757, 3556],
    // Interacciones por mes, enero a agosto
    monthly: [61200, 66800, 72500, 70100, 84300, 92700, 104200, 126480],
  },
  {
    id: "kyros",
    name: "Kyros",
    handle: "@kyrosclo",
    initial: "K",
    views: 486900,
    viewsPrev: 358000,
    reach: 221300,
    reachPrev: 176800,
    interactions: 38920,
    interactionsPrev: 29480,
    followersStart: 12640,
    followersEnd: 14105,
    milestone: {
      title: "¡Agosto fue el mejor mes de Kyros!",
      body: "El lanzamiento de la colección Otoño subió las visualizaciones un 36% y la comunidad creció 11.6% en un solo mes.",
      goal: 15000,
    },
    seedNotes: [
      { id: "k-1", text: "Lanzamiento colección Otoño con 2 creadores invitados (28 ago).", date: "28 ago 2026" },
    ],
    posts: [
      { id: "k1", title: "Lanzamiento: colección Otoño", type: "reel", day: 28, views: 142300, likes: 9600 },
      { id: "k2", title: "Cómo elegimos nuestros materiales", type: "carrusel", day: 23, views: 58700, likes: 4200 },
      { id: "k3", title: "Lookbook nocturno", type: "foto", day: 18, views: 31400, likes: 3100 },
      { id: "k4", title: "Un día en el estudio", type: "reel", day: 11, views: 96800, likes: 6900 },
    ],
    gender: [
      { label: "Hombres", value: 54.2 },
      { label: "Mujeres", value: 45.8 },
    ],
    countries: [
      { code: "MX", label: "México", value: 71.5 },
      { code: "US", label: "Estados Unidos", value: 9.2 },
      { code: "CL", label: "Chile", value: 5.3 },
      { code: "PE", label: "Perú", value: 4.6 },
      { code: "ES", label: "España", value: 3.1 },
    ],
    cities: [
      { label: "Monterrey", value: 18.7 },
      { label: "Ciudad de México", value: 17.2 },
      { label: "Guadalajara", value: 8.4 },
      { label: "Querétaro", value: 5.6 },
      { label: "Houston", value: 2.9 },
    ],
    daily: [855, 945, 755, 903, 834, 853, 974, 1109, 1128, 900, 1600, 1361, 1176, 1043, 1067, 1091, 994, 1725, 1368, 1192, 1196, 1178, 2077, 1399, 1229, 1098, 1254, 2712, 2282, 1522, 1100],
    monthly: [14200, 15900, 17400, 19800, 22600, 25100, 29480, 38920],
  },
];

const TYPE_LABEL = { reel: "Reel", carrusel: "Carrusel", foto: "Foto", historia: "Historia" };
const TYPE_ICON = { reel: "play", carrusel: "copy", foto: "image", historia: "play" };

/* ------------------------------------------------------------------ */
/*  Datos en vivo (capability `mcp` del artefacto)                     */
/*  · Instagram: conector Composio (Instagram Graph API)               */
/*  · TikTok: conector Metricool                                       */
/* ------------------------------------------------------------------ */

const CP_SERVER = "Composio";
const CP_TOOL = "COMPOSIO_MULTI_EXECUTE_TOOL";
const CP_CONNECTIONS = "COMPOSIO_MANAGE_CONNECTIONS"; // solo se usa con action "list" para descubrir las cuentas conectadas
const MC_SERVER = "Metricool Social Media Management";
const MC_BRANDS = "getBrandSettings";
const MC_DATA = "getAnalyticsDataByMetrics";
const TK_EVOLUTION = ["TKEV07", "TKEV02", "TKEV06", "TKEV11"]; // Metricool devuelve { rows: [[...valores, "AAAAMMDD"]] }
const CACHE_OPTIONS = { staleTime: 5 * 60 * 1000, gcTime: 24 * 60 * 60 * 1000 };

// Métricas totales de cuenta que se piden a Instagram para cada ventana de 30 días
const IG_TOTALS = ["reach", "views", "accounts_engaged", "total_interactions", "likes", "comments", "shares", "saves", "replies", "profile_views"];

// Estos códigos significan que el acceso ya no vale: se retiran los datos mostrados
const RETRACT_CODES = new Set(["needs_reauth", "server_not_connected", "blocked_by_policy", "approval_required", "not_in_manifest", "selection_required", "not_granted", "capability_disabled", "capability_removed"]);

function errorCopy(err, service = "Composio") {
  if (!err) return "";
  switch (err.code) {
    case "server_not_connected":
      return `Agrega ${service} en claude.ai → Configuración → Conectores para ver tus datos reales.`;
    case "selection_required":
      return `Tienes más de una conexión de ${service}. Elige cuál usar en el aviso de claude.ai.`;
    case "needs_reauth":
      return `Tu conexión con ${service} expiró. Reconéctala en claude.ai → Configuración → Conectores.`;
    case "not_in_manifest":
      return `Esta página no tiene permiso para leer ${service}. Recárgala y acepta el acceso cuando te lo pida.`;
    case "blocked_by_policy":
      return `Tu organización no permite usar ${service} desde esta página.`;
    case "approval_required":
      return `Tu organización pide aprobar cada consulta a ${service}, y eso todavía no funciona en esta página.`;
    case "server_unavailable":
      return `${service} no respondió a tiempo. Intenta de nuevo en un momento.`;
    case "not_granted":
    case "capability_disabled":
    case "capability_removed":
      return "Esta vista no puede usar conectores.";
    case "tool_error":
      return `${service} devolvió un error${err.message ? `: ${err.message}` : "."}`;
    default:
      return `No se pudo leer ${service}. Intenta de nuevo en un momento.`;
  }
}
const canRetry = (err) => !!err && (err.retryable || err.code === "server_unavailable" || err.code === "upstream_error" || err.code === "tool_error");

/* ------------------------------------------------------------------ */
/*  Investigación de tendencias (septiembre 2026)                      */
/*  Cada tip cita sus fuentes por clave de SOURCES.                    */
/* ------------------------------------------------------------------ */

const RESEARCH_DATE = "28 sep 2026";

const SOURCES = {
  later: { label: "Later", url: "https://later.com/blog/how-instagram-algorithm-works/" },
  hootsuite: { label: "Hootsuite", url: "https://blog.hootsuite.com/instagram-algorithm/" },
  dataslayer: { label: "Dataslayer", url: "https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers" },
  socialbee: { label: "SocialBee", url: "https://socialbee.com/blog/latest-instagram-trends/" },
  omalik: { label: "Om Malik (memo de Mosseri)", url: "https://om.co/2026/01/01/what-is-instagrams-adam-mosseri-really-saying-in-his-year-end-memo/" },
  opus: { label: "OpusClip", url: "https://www.opus.pro/blog/instagram-reels-hook-formulas" },
  hopper: { label: "Hopper HQ", url: "https://www.hopperhq.com/blog/instagram-posting-frequency-2026/" },
  buffer: { label: "Buffer", url: "https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/" },
  creatorflow: { label: "Creatorflow", url: "https://creatorflow.so/blog/instagram-collab-post-dm-automation-strategy/" },
  carouselli: { label: "Carouselli", url: "https://carouselli.com/blog/instagram-carousel-best-practices" },
  truefuture: { label: "TrueFuture Media", url: "https://www.truefuturemedia.com/articles/instagram-carousel-strategy-2026" },
  toptal: { label: "Toptal", url: "https://www.toptal.com/creator/post/instagram-seo" },
  socialinsider: { label: "Socialinsider", url: "https://www.socialinsider.io/social-media-benchmarks/instagram" },
  metricool: { label: "Metricool", url: "https://metricool.com/instagram-trends/" },
  heraldo: { label: "El Heraldo de Saltillo", url: "https://elheraldodesaltillo.mx/2026/05/05/crecer-en-instagram-en-2026-estrategias-reales-para-creadores-y-negocios-mexicanos/" },
  trymypost: { label: "TryMyPost", url: "https://www.trymypost.com/blog/instagram-broadcast-channels-strategy-guide-2026" },
};

const TIPS = {
  trends: [
    { id: "t1", icon: "play", tag: "Formato", title: "Reels cortos con hook fuerte", body: "Siguen siendo el formato número uno para llegar a gente que no te sigue. Lo que más crece son reels de 15 a 30 segundos pensados para verse más de una vez.", src: ["later", "hootsuite"] },
    { id: "t2", icon: "copy", tag: "Formato", title: "Carruseles para guardar", body: "Guías paso a paso, listas y comparativas de 7 a 10 slides. Generan más guardados que cualquier otro formato e Instagram los vuelve a mostrar 24 a 48 horas después.", src: ["carouselli", "socialinsider"] },
    { id: "t3", icon: "camera", tag: "Estilo", title: "Contenido crudo y detrás de cámaras", body: "En su memo del 31 de diciembre de 2025, Mosseri dio por muerta la estética «perfecta». Lo grabado con el celular, con tu cara y sin tanta producción le está ganando a lo súper pulido.", src: ["omalik", "dataslayer"] },
    { id: "t4", icon: "sparkles", tag: "Trends de septiembre", title: "Whimsymaxxing y «Two friends, two vibes»", body: "Maximalismo Y2K (brillos, charms y stickers en objetos del día a día, mientras más exagerado mejor) y videos de dos amigos con gustos opuestos. Los dos se prestan para colabs.", src: ["socialbee"] },
    { id: "t5", icon: "music", tag: "Audio", title: "«Less Than a Lover» de JENNIE", body: "Salió en julio de 2026 y ya va en más de 221 mil reels. Encaja con contenido aesthetic, inspiracional o romántico.", src: ["socialbee"] },
    { id: "t6", icon: "pin", tag: "Local", title: "Súmate a fechas y modismos de México", body: "Lo regional genera conversación con tu público real. Lo que sigue es Día de Muertos (1 y 2 de noviembre), así que conviene grabar desde octubre.", src: ["metricool", "heraldo"] },
  ],
  virality: [
    { id: "v1", icon: "send", tag: "Señal confirmada", title: "Haz contenido para mandar por DM", body: "Los envíos por DM son la señal más fuerte para llegar a no seguidores. Pregúntate a quién le mandaría alguien tu reel y dilo en el video: «mándaselo a tu amigo que…».", src: ["hootsuite", "later"] },
    { id: "v2", icon: "repeat", tag: "Señal confirmada", title: "Tiempo visto y repeticiones", body: "Instagram mide el tiempo total visto y cuántas veces se repite el video. Un reel de 15 segundos visto 3 veces le gana a uno de 60 visto una vez, así que haz que el final conecte con el inicio.", src: ["dataslayer", "later"] },
    { id: "v3", icon: "flag", tag: "Regla", title: "Solo contenido original", body: "El contenido original recibe entre 40% y 60% más distribución que los reposts, y 10 o más reposts en 30 días te sacan de las recomendaciones.", src: ["dataslayer"] },
    { id: "v4", icon: "search", tag: "SEO", title: "Palabras clave antes que hashtags", body: "Instagram lee tu caption como un buscador. Repite el tema en el caption, en el texto en pantalla y en lo que dices, y usa solo 3 a 5 hashtags específicos.", src: ["toptal"] },
    { id: "v5", icon: "flask", tag: "Herramienta", title: "Prueba hooks con Trial Reels", body: "Publica primero solo para no seguidores y revisa cómo responde antes de mostrarlo en tu perfil. Sirve para probar dos hooks distintos del mismo video.", src: ["hootsuite"] },
    { id: "v6", icon: "calendar", tag: "Frecuencia", title: "Constancia antes que volumen", body: "De 3 a 5 publicaciones por semana (por ejemplo, 2 a 4 reels y 2 a 3 carruseles) más 1 o 2 historias diarias. Un ritmo que puedas sostener vale más que un pico.", src: ["buffer", "hopper"] },
  ],
  engagement: [
    { id: "e1", icon: "users", tag: "Alcance", title: "Publica en colaboración", body: "Un post en colab sale en el perfil de hasta 5 cuentas a la vez. Se reportan hasta 4.8 veces más impresiones que un post individual, y ya puedes agregar colaboradores después de publicar.", src: ["creatorflow"] },
    { id: "e2", icon: "message", tag: "Conversación", title: "«Comenta PALABRA y te lo mando»", body: "Pide una palabra clave en comentarios y responde con un DM automático. Meta lo permite cuando el usuario inicia la acción, y dispara comentarios y conversaciones.", src: ["creatorflow"] },
    { id: "e3", icon: "heart", tag: "Conversación", title: "Responde con preguntas", body: "Los comentarios cuentan cuando son más que un emoji. Contesta rápido y con una pregunta para que la conversación siga en tu post.", src: ["creatorflow"] },
    { id: "e4", icon: "copy", tag: "Carruseles", title: "Slide 1 es el hook y la 2 tu mejor dato", body: "Quien pasa a la segunda slide casi siempre termina el carrusel. Pon ahí tu segundo mejor insight y cierra con una razón para guardarlo.", src: ["carouselli", "truefuture"] },
    { id: "e5", icon: "megaphone", tag: "Comunidad", title: "Abre un canal de difusión", body: "Queda fijo en la bandeja de DMs. Úsalo para lanzamientos y adelantos; los creadores activos reportan tasas de apertura arriba del 70%.", src: ["trymypost"] },
    { id: "e6", icon: "bookmark", tag: "Guardados", title: "Da una razón para guardar", body: "Checklists, plantillas, precios y paso a paso. Los guardados pesan mucho en el feed, así que termina con «guárdalo para cuando…».", src: ["carouselli"] },
  ],
};

const HOOKS = [
  { id: "h1", type: "Resultado específico", template: "Así pasé de [antes] a [después] en [tiempo], sin [objeción]", example: "Así pasé de 0 a 10 mil seguidores en 90 días, sin pagar anuncios" },
  { id: "h2", type: "POV", template: "POV: eres [persona] y [situación muy específica]", example: "POV: eres editor y el cliente pide «algo más dinámico»" },
  { id: "h3", type: "Opinión impopular", template: "Opinión impopular: [creencia común] no sirve", example: "Opinión impopular: publicar diario no te va a hacer crecer" },
  { id: "h4", type: "Curiosidad con número", template: "Analicé [N] [cosas] y esto es lo que nadie te dice", example: "Analicé 100 reels virales y esto es lo que tienen en común" },
  { id: "h5", type: "Error común", template: "Si haces [X], estás perdiendo [resultado]", example: "Si subes reels sin texto en pantalla, estás perdiendo vistas" },
  { id: "h6", type: "Pregunta", template: "¿Pagarías [precio] por [producto]… si viniera con esto?", example: "¿Pagarías 400 pesos por una playera… si durara 10 años?" },
  { id: "h7", type: "Timelapse", template: "[N] [años/meses] de [proceso] en [N] segundos", example: "3 años de progreso en 30 segundos" },
  { id: "h8", type: "Contradicción", template: "¿[Emoción]? Totalmente. ¿[Lo contrario]? Ni tantito.", example: "¿Nervioso? Totalmente. ¿Listo? Ni tantito." },
];

const REEL_STRUCTURE = [
  { range: "0–3 s", title: "Hook", body: "Imagen que frena el scroll y texto en pantalla de 5 a 8 palabras.", weight: 3 },
  { range: "4–10 s", title: "Problema", body: "Nombra el dolor o la situación que tu público reconoce.", weight: 7 },
  { range: "11–20 s", title: "Prueba", body: "Demuestra, enseña el resultado o el paso a paso.", weight: 10 },
  { range: "Final", title: "Llamado a la acción", body: "Pide una sola cosa: mandarlo, guardarlo o comentar.", weight: 5 },
];

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */

const nf = new Intl.NumberFormat("es-MX");
const trimZeros = (s) => s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

function formatNumber(n, compact = true) {
  if (!isNum(n)) return "—";
  const r = Math.round(n);
  if (!compact) return nf.format(r);
  const a = Math.abs(r);
  if (a >= 1e6) return trimZeros((r / 1e6).toFixed(2)) + "M";
  if (a >= 1e4) return trimZeros((r / 1e3).toFixed(1)) + "K";
  return nf.format(r);
}

function formatAxis(n) {
  if (n === 0) return "0";
  if (n >= 1e6) return trimZeros((n / 1e6).toFixed(1)) + "M";
  if (n >= 1e3) return trimZeros((n / 1e3).toFixed(1)) + "K";
  return String(n);
}

const signedPct = (v, digits = 1) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(digits)}%`;
const pctChange = (cur, prev) => ((cur - prev) / prev) * 100;
const deltaOrNull = (cur, prev) => (isNum(cur) && isNum(prev) && prev > 0 ? pctChange(cur, prev) : null);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const avg = (arr) => (arr.length ? sum(arr) / arr.length : 0);
const argmax = (arr) => arr.reduce((best, v, i) => (v > arr[best] ? i : best), 0);
const argmin = (arr) => arr.reduce((best, v, i) => (v < arr[best] ? i : best), 0);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const toNum = (v) => (v == null || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);
const sumNullable = (arr) => (arr.some(isNum) ? sum(arr.filter(isNum)) : null);

function todayLabel() {
  return capitalize(new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
}

function shortDate(d = new Date()) {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
}

// Fechas "de calendario": se guardan como timestamps UTC al mediodía para no depender de la zona del visitante
const utcDay = (y, m, d) => Date.UTC(y, m, d, 12);
const DAY_MS = 86400000;
function fmtUtc(ts, opts) {
  return new Date(ts).toLocaleDateString("es-MX", { timeZone: "UTC", ...opts }).replace(/\./g, "");
}
const dayMonth = (ts) => `${new Date(ts).getUTCDate()} ${fmtUtc(ts, { month: "short" })}`;
const weekdayDayMonth = (ts) => `${fmtUtc(ts, { weekday: "short" })} ${dayMonth(ts)}`;
function rangeText(fromTs, toTs) {
  return `${dayMonth(fromTs)} – ${dayMonth(toTs)} ${new Date(toTs).getUTCFullYear()}`;
}
// Momento real (hora local del visitante), p. ej. para historias
function localDayTime(ts) {
  const d = new Date(ts);
  const day = `${d.getDate()} ${d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")}`;
  return `${day}, ${d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`;
}
function ymdToTs(ymd) {
  const m = String(ymd).match(/^(\d{4})-?(\d{2})-?(\d{2})/);
  return m ? utcDay(+m[1], +m[2] - 1, +m[3]) : null;
}
const tsToKey = (ts) => new Date(ts).toISOString().slice(0, 10).replace(/-/g, "");

function tzOffset(timeZone) {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName");
    const m = part && part.value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    return m ? `${m[1]}${m[2].padStart(2, "0")}:${m[3] || "00"}` : "+00:00";
  } catch {
    return "-06:00";
  }
}
function todayIn(timeZone) {
  try {
    return ymdToTs(new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()));
  } catch {
    const d = new Date();
    return utcDay(d.getFullYear(), d.getMonth(), d.getDate());
  }
}

// Últimos 30 días completos en la zona horaria de la marca (para Metricool)
function metricoolWindow(timeZone) {
  const off = tzOffset(timeZone);
  const today = todayIn(timeZone);
  const start = today - 30 * DAY_MS;
  const iso = (ts, time) => `${new Date(ts).toISOString().slice(0, 10)}T${time}${off}`;
  return { days: Array.from({ length: 30 }, (_, i) => start + i * DAY_MS), from: iso(start, "00:00:00"), to: iso(today, "23:59:59") };
}

// Ventanas de 30 días para Instagram, redondeadas a la hora para que la caché sirva entre recargas
function instagramWindows() {
  const until = Math.floor(Date.now() / 3600000) * 3600;
  const since = until - 30 * 86400;
  return { until, since, prevSince: since - 30 * 86400 };
}

let regionNames = null;
function countryName(code) {
  try {
    regionNames = regionNames || new Intl.DisplayNames(["es"], { type: "region" });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}

function weekdayAveragesFrom(pairs) {
  const sums = Array(7).fill(0);
  const counts = Array(7).fill(0);
  pairs.forEach(([ts, v]) => {
    if (!isNum(v)) return;
    const wd = new Date(ts).getUTCDay();
    sums[wd] += v;
    counts[wd] += 1;
  });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : null));
}

// Escala "bonita": el menor paso (1, 2, 2.5, 5 × 10^n) que cubre el máximo en ≤ 5 divisiones
function niceScale(maxVal) {
  const steps = [];
  for (let e = 0; e <= 8; e++) for (const m of [1, 2, 2.5, 5]) steps.push(m * 10 ** e);
  const safeMax = Math.max(1, maxVal);
  const step = steps.find((s) => Math.ceil(safeMax / s) <= 5) || steps[steps.length - 1];
  const count = Math.max(1, Math.ceil(safeMax / step));
  return { max: count * step, ticks: Array.from({ length: count + 1 }, (_, i) => i * step) };
}

// Curva spline monótona (Fritsch–Carlson): suave y sin "rebotes" por debajo de los datos
function monotonePath(pts) {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const dx = [], m = [], t = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) {
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

const STORE_KEY = "ig-analytics-dashboard-v1";
function loadStore() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
function saveStore(data) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    /* almacenamiento no disponible: el panel sigue funcionando en memoria */
  }
}

function systemTheme() {
  try {
    const host = document.documentElement.getAttribute("data-theme");
    if (host === "light" || host === "dark") return host;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

/* ------------------------------------------------------------------ */
/*  Modelo de ejemplo: cada cuenta (ejemplo o en vivo) se convierte en */
/*  la misma forma que leen las tarjetas.                              */
/* ------------------------------------------------------------------ */

function sampleModel(r) {
  const net = r.followersEnd - r.followersStart;
  const dayTs = r.daily.map((_, i) => utcDay(PERIOD.year, PERIOD.monthIndex, i + 1));
  const tip = dayTs.map(weekdayDayMonth);
  const peak = argmax(r.daily);
  const monthPeak = argmax(r.monthly);
  const postViews = sum(r.posts.map((p) => p.views));

  return {
    id: r.id,
    name: r.name,
    handle: r.handle,
    initial: r.initial,
    source: "sample",
    periodLabel: PERIOD.label,
    rangeLabel: `1 – 31 ${PERIOD.short} ${PERIOD.year}`,
    compareSuffix: `vs ${PERIOD.prevMonth}`,
    hero: {
      badge: "Mensual",
      primary: { label: "Visualizaciones totales", value: r.views, delta: pctChange(r.views, r.viewsPrev) },
      secondary: { label: "Seguidores netos del mes", value: net, signed: true, note: `${nf.format(r.followersEnd)} seguidores en total` },
      minis: [
        { icon: "heart", label: "Interacciones", value: r.interactions, delta: pctChange(r.interactions, r.interactionsPrev), note: "likes, comentarios y más" },
        { icon: "trending", label: "Crecimiento", value: (net / r.followersStart) * 100, format: "signedPercent", note: "de seguidores" },
        { icon: "radio", label: "Alcance", value: r.reach, delta: pctChange(r.reach, r.reachPrev), note: "cuentas únicas" },
        { icon: "activity", label: "Engagement", value: (r.interactions / r.views) * 100, format: "percent", note: "interacciones / vistas" },
      ],
    },
    milestone: r.milestone,
    seedNotes: r.seedNotes,
    followers: r.followersEnd,
    peak: { title: "Día récord", sub: `${tip[peak]} · interacciones`, value: r.daily[peak] },
    posts: {
      state: "ready",
      subtitle: "Publicaciones recientes",
      items: r.posts.map((p, i) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        icon: TYPE_ICON[p.type],
        ts: utcDay(PERIOD.year, PERIOD.monthIndex, p.day),
        dateLabel: `${p.day} ${PERIOD.short}`,
        primary: p.views,
        secondary: { icon: "heart", label: "Me gusta", value: p.likes },
        tone: TONES[i % TONES.length],
      })),
      note: (
        <>
          Estas 4 publicaciones generaron el <strong>{((postViews / r.views) * 100).toFixed(0)}%</strong> de tus visualizaciones de {PERIOD.month}.
        </>
      ),
    },
    audience: {
      subtitle: `Seguidores al 31 ${PERIOD.short} ${PERIOD.year}`,
      gender: r.gender,
      locations: { countries: r.countries, cities: r.cities },
    },
    charts: [
      {
        id: "daily",
        label: "Diario",
        subtitle: `Interacciones por día · ${PERIOD.month} ${PERIOD.year}`,
        values: r.daily,
        tipLabels: tip,
        axisLabels: r.daily.map((_, i) => (i % 7 === 0 ? `${i + 1} ${PERIOD.short}` : "")),
        unit: "interacciones",
        total: sum(r.daily),
        totalLabel: `interacciones en ${PERIOD.month}`,
        delta: pctChange(r.interactions, r.interactionsPrev),
        deltaSuffix: `vs ${PERIOD.prevMonth}`,
        stats: [
          { label: "Promedio diario", value: avg(r.daily) },
          { label: "Día récord", value: r.daily[peak], sub: tip[peak] },
        ],
        ariaLabel: `Interacciones diarias de ${r.name} en ${PERIOD.month} ${PERIOD.year}`,
      },
      {
        id: "monthly",
        label: "Mensual",
        subtitle: `Interacciones por mes · ene – ${PERIOD.short} ${PERIOD.year}`,
        values: r.monthly,
        tipLabels: MONTHS_LONG.map((m) => `${m} ${PERIOD.year}`),
        axisLabels: MONTHS,
        unit: "interacciones",
        total: sum(r.monthly),
        totalLabel: `interacciones en ${PERIOD.year}`,
        delta: pctChange(r.monthly[r.monthly.length - 1], r.monthly[0]),
        deltaSuffix: `${PERIOD.short} vs ene`,
        stats: [
          { label: "Promedio mensual", value: avg(r.monthly) },
          { label: "Mejor mes", value: r.monthly[monthPeak], sub: `${MONTHS_LONG[monthPeak]} ${PERIOD.year}` },
        ],
        ariaLabel: `Interacciones mensuales de ${r.name}, enero a ${PERIOD.month} ${PERIOD.year}`,
      },
    ],
    buildInsights: (goal) => sampleInsights(r, goal, dayTs),
    networks: null,
  };
}

function sampleInsights(r, goalValue, dayTs) {
  const reels = r.posts.filter((p) => p.type === "reel");
  const others = r.posts.filter((p) => p.type !== "reel");
  const reelAvg = avg(reels.map((p) => p.views));
  const otherAvg = avg(others.map((p) => p.views));
  const weekday = weekdayAveragesFrom(dayTs.map((ts, i) => [ts, r.daily[i]]));
  const best = argmax(weekday.map((v) => (isNum(v) ? v : -Infinity)));
  const worst = argmin(weekday.map((v) => (isNum(v) ? v : Infinity)));
  const net = r.followersEnd - r.followersStart;
  const perDay = net / PERIOD.days;
  const goal = Math.max(1, Number(goalValue) || r.milestone.goal);
  const remaining = Math.max(0, goal - r.followersEnd);
  const topGender = [...r.gender].sort((a, b) => b.value - a.value)[0];

  return [
    {
      id: "format",
      icon: "play",
      label: "Formato ganador",
      stat: `${(reelAvg / otherAvg).toFixed(1)}×`,
      text: `Tus reels promedian ${formatNumber(reelAvg)} vistas contra ${formatNumber(otherAvg)} de tus carruseles y fotos.`,
      action: "Sube a 3 o 4 reels por semana y convierte tu carrusel con más vistas en reel.",
    },
    {
      id: "weekday",
      icon: "calendar",
      label: "Tu mejor día",
      stat: capitalize(WEEKDAYS[best]),
      text: `Los ${WEEKDAYS[best]} promedias ${nf.format(Math.round(weekday[best]))} interacciones, ${pctChange(weekday[best], weekday[worst]).toFixed(0)}% más que los ${WEEKDAYS[worst]}.`,
      action: `Guarda tu mejor contenido para los ${WEEKDAYS[best]} y usa los ${WEEKDAYS[worst]} para probar hooks.`,
    },
    remaining > 0
      ? {
          id: "goal",
          icon: "target",
          label: "Ritmo hacia tu meta",
          stat: `~${Math.ceil(remaining / perDay)} días`,
          text: `Al ritmo de ${PERIOD.month} (+${nf.format(Math.round(perDay))} seguidores al día) te faltan ${nf.format(remaining)} para llegar a ${nf.format(goal)}.`,
          action: "Acelera con un post en colaboración o un «comenta PALABRA» esta semana.",
        }
      : {
          id: "goal",
          icon: "target",
          label: "Ritmo hacia tu meta",
          stat: "Cumplida",
          text: `Ya pasaste tu meta de ${nf.format(goal)} seguidores.`,
          action: "Sube la meta desde Editar para seguir midiendo tu avance.",
        },
    {
      id: "audience",
      icon: "pin",
      label: "Tu público",
      stat: `${r.countries[0].value.toFixed(0)}%`,
      text: `de tus seguidores está en ${r.countries[0].label} y el ${topGender.value.toFixed(0)}% son ${topGender.label.toLowerCase()}.`,
      action: "Aprovecha fechas locales: empieza a grabar contenido de Día de Muertos en octubre.",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Instagram en vivo vía Composio                                     */
/* ------------------------------------------------------------------ */

// Lecturas por cuenta; todas las cuentas van en la misma llamada al ejecutor de Composio
const B = { user: 0, media: 1, stories: 2, totals: 3, prevTotals: 4, byType: 5, follows: 6, series: 7, prevSeries: 8, gender: 9, age: 10, country: 11, city: 12 };
const BATCH_SIZE = 13;
const MAX_BATCH_ITEMS = 48; // el ejecutor acepta hasta 50 herramientas por llamada
const MEDIA_INSIGHTS_PER_ACCOUNT = 6;
const FEED_METRICS = ["views", "reach", "likes", "comments", "saved", "shares"];
const STORY_METRICS = ["views", "reach", "total_interactions"];

function instagramBatch(w, account) {
  const tool = (tool_slug, args) => (account ? { tool_slug, account, arguments: args } : { tool_slug, arguments: args });
  const insights = (args) => tool("INSTAGRAM_GET_USER_INSIGHTS", args);
  const demographics = (breakdown) => insights({ metric: ["follower_demographics"], period: "lifetime", timeframe: "this_month", metric_type: "total_value", breakdown });
  return [
    tool("INSTAGRAM_GET_USER_INFO", { ig_user_id: "me", fields: "id,username,name,followers_count,follows_count,media_count" }),
    tool("INSTAGRAM_GET_IG_USER_MEDIA", { ig_user_id: "me", limit: 25, fields: "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,view_count" }),
    tool("INSTAGRAM_GET_IG_USER_STORIES", { fields: "id,media_type,permalink,timestamp,caption" }),
    insights({ metric: IG_TOTALS, period: "day", metric_type: "total_value", since: w.since, until: w.until }),
    insights({ metric: IG_TOTALS, period: "day", metric_type: "total_value", since: w.prevSince, until: w.since }),
    insights({ metric: ["views", "reach"], period: "day", metric_type: "total_value", breakdown: "media_product_type", since: w.since, until: w.until }),
    insights({ metric: ["follows_and_unfollows"], period: "day", metric_type: "total_value", breakdown: "follow_type", since: w.since, until: w.until }),
    insights({ metric: ["reach"], period: "day", metric_type: "time_series", since: w.since, until: w.until }),
    insights({ metric: ["reach"], period: "day", metric_type: "time_series", since: w.prevSince, until: w.since }),
    demographics("gender"),
    demographics("age"),
    demographics("country"),
    demographics("city"),
  ];
}

// Cuentas de Instagram activas en Composio (respuesta de COMPOSIO_MANAGE_CONNECTIONS con action "list")
function parseConnections(result) {
  const json = coerceJson(result);
  const accounts = json?.data?.results?.instagram?.accounts;
  if (!Array.isArray(accounts)) return [];
  return accounts
    .filter((a) => a && a.id && String(a.status).toLowerCase() === "active" && a.user_info?.username)
    .map((a) => ({ id: a.id, alias: a.alias || null, username: a.user_info.username, userId: a.user_info.id || null }))
    .sort((a, b) => a.username.localeCompare(b.username));
}

const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
const titleCase = (s) => String(s).toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

// El conector puede entregar el JSON ya interpretado (payload) o como texto; esto lo normaliza
function coerceJson(result) {
  const p = result?.payload;
  if (p && typeof p === "object") return p;
  const text = typeof p === "string" ? p : (result?.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    /* puede traer texto extra al final */
  }
  const start = text.indexOf("{");
  let end = text.lastIndexOf("}");
  for (let tries = 0; start >= 0 && end > start && tries < 60; tries++) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      end = text.lastIndexOf("}", end - 1);
    }
  }
  return null;
}

// Respuesta del ejecutor → arreglo por índice con { ok, data, error }
function parseBatch(result) {
  const json = coerceJson(result);
  const results = json?.data?.results;
  if (!Array.isArray(results)) {
    const message = typeof json?.error === "string" ? json.error : json?.error?.message;
    throw { code: "tool_error", message: message || "Respuesta inesperada del ejecutor." };
  }
  const out = [];
  results.forEach((r, i) => {
    const idx = Number.isInteger(r?.index) ? r.index : i;
    const res = r?.response || {};
    out[idx] = res.successful ? { ok: true, data: res.data } : { ok: false, error: typeof res.error === "string" ? res.error : res.error?.message || "Instagram devolvió un error" };
  });
  return out;
}
const okData = (entry) => (entry && entry.ok ? entry.data : null);
const listOf = (data) => (Array.isArray(data?.data) ? data.data : []);

function insightTotals(data) {
  const map = {};
  listOf(data).forEach((m) => {
    const v = toNum(m?.total_value?.value ?? m?.values?.[0]?.value);
    if (m?.name && isNum(v)) map[m.name] = v;
  });
  return map;
}
function insightBreakdown(data, metric) {
  const row = listOf(data).find((m) => !metric || m?.name === metric);
  const results = row?.total_value?.breakdowns?.[0]?.results;
  return Array.isArray(results)
    ? results.map((r) => ({ key: r?.dimension_values?.[0], value: toNum(r?.value) })).filter((r) => r.key != null && isNum(r.value))
    : [];
}
// Serie diaria: el valor con end_time del día D corresponde a ese día D (coincide con los picos del día
// en que se publicó). Se omite el día en curso, que Instagram todavía no termina de procesar.
function insightSeries(data) {
  const values = Array.isArray(listOf(data)[0]?.values) ? listOf(data)[0].values : [];
  const cutoff = Date.now() - DAY_MS;
  return values
    .map((v) => ({ end: Date.parse(v?.end_time), value: toNum(v?.value) }))
    .filter((v) => Number.isFinite(v.end) && isNum(v.value) && v.end <= cutoff)
    .map((v) => {
      const d = new Date(v.end);
      return { ts: utcDay(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), value: v.value };
    });
}
function shareRows(rows, mapLabel, limit = 5) {
  const total = sum(rows.map((r) => r.value));
  if (!total) return null;
  return [...rows]
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((r) => ({ ...mapLabel(r.key), value: (r.value / total) * 100 }));
}

const AGE_ORDER = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const GENDER_LABEL = { F: "Mujeres", M: "Hombres", U: "Sin especificar" };
const PRODUCT_LABEL = { STORY: "historias", REEL: "reels", POST: "publicaciones", CAROUSEL_CONTAINER: "carruseles", AD: "anuncios" };

function mapMediaType(mediaType, productType) {
  if (productType === "REELS") return "reel";
  if (mediaType === "CAROUSEL_ALBUM") return "carrusel";
  if (mediaType === "VIDEO") return "reel";
  return "foto";
}
const captionTitle = (caption, fallback) => {
  const first = String(caption || "").split("\n")[0].trim();
  return first ? (first.length > 80 ? `${first.slice(0, 78)}…` : first) : fallback;
};
const safeUrl = (u) => (typeof u === "string" && /^https:\/\//.test(u) ? u : null);

// live = { conn: cuenta de Composio (o null = predeterminada), batch, mediaInsights: { [mediaId]: métricas }, storedAt }
function instagramModel(live) {
  const batch = live.batch;
  const conn = live.conn || {};
  const user = okData(batch[B.user]) || {};
  const username = user.username || conn.username || "instagram";
  const mediaInsights = live.mediaInsights || {};
  const totals = insightTotals(okData(batch[B.totals]));
  const prev = insightTotals(okData(batch[B.prevTotals]));
  // Instagram a veces agrega una categoría técnica ("DEFAULT_DO_NOT_USE") que no es un formato real
  const byType = insightBreakdown(okData(batch[B.byType]), "views").filter((r) => !String(r.key).startsWith("DEFAULT"));
  const followRows = insightBreakdown(okData(batch[B.follows]), "follows_and_unfollows");
  const cur = insightSeries(okData(batch[B.series]));
  const before = insightSeries(okData(batch[B.prevSeries]));
  const followers = toNum(user.followers_count);
  const mediaCount = toNum(user.media_count);

  const views = totals.views ?? null;
  const reach = totals.reach ?? null;
  const engaged = totals.accounts_engaged ?? null;
  const interactions = totals.total_interactions ?? null;
  const profileViews = totals.profile_views ?? null;
  const reachDelta = deltaOrNull(reach, prev.reach);
  const viewsDelta = deltaOrNull(views, prev.views);
  const follows = followRows.find((r) => r.key === "FOLLOWER")?.value ?? null;
  const unfollows = followRows.find((r) => r.key === "NON_FOLLOWER")?.value ?? null;
  const net = isNum(follows) || isNum(unfollows) ? (follows || 0) - (unfollows || 0) : null;
  const rate = isNum(engaged) && isNum(reach) && reach > 0 ? (engaged / reach) * 100 : null;

  const rangeLabel = cur.length ? rangeText(cur[0].ts, cur[cur.length - 1].ts) : "Últimos 30 días";
  const curVals = cur.map((p) => p.value);
  const hasSeries = curVals.length > 1;
  const peakIdx = hasSeries ? argmax(curVals) : 0;
  const tip = cur.map((p) => weekdayDayMonth(p.ts));
  const both = [...before, ...cur];
  const bothVals = both.map((p) => p.value);
  const bothPeak = bothVals.length ? argmax(bothVals) : 0;
  const bothTip = both.map((p) => weekdayDayMonth(p.ts));

  // Contenido: publicaciones del feed; si no hay, las historias activas
  const mediaEntry = batch[B.media];
  const storiesEntry = batch[B.stories];
  const feed = listOf(okData(mediaEntry)).map((m, i) => {
    const ts = Date.parse(m.timestamp);
    const type = mapMediaType(m.media_type, m.media_product_type);
    const ins = mediaInsights[m.id] || {};
    return {
      id: m.id || `m-${i}`,
      title: captionTitle(m.caption, "Publicación sin texto"),
      type,
      icon: TYPE_ICON[type],
      ts: Number.isFinite(ts) ? ts : 0,
      dateLabel: Number.isFinite(ts) ? localDayTime(ts) : "",
      // Las vistas por post vienen de sus métricas individuales (view_count casi nunca llega en el listado)
      primary: toNum(ins.views ?? m.view_count),
      secondary: { icon: "heart", label: "Me gusta", value: toNum(ins.likes ?? m.like_count) },
      url: safeUrl(m.permalink),
      tone: TONES[i % TONES.length],
    };
  });
  const stories = listOf(okData(storiesEntry)).map((s, i) => {
    const ts = Date.parse(s.timestamp);
    const ins = mediaInsights[s.id] || {};
    return {
      id: s.id || `s-${i}`,
      title: captionTitle(s.caption, "Historia sin texto"),
      type: "historia",
      icon: s.media_type === "VIDEO" ? "play" : "image",
      ts: Number.isFinite(ts) ? ts : 0,
      dateLabel: Number.isFinite(ts) ? localDayTime(ts) : "",
      primary: toNum(ins.views),
      secondary: { icon: "users", label: "Alcance", value: toNum(ins.reach) },
      url: safeUrl(s.permalink),
      tone: TONES[i % TONES.length],
    };
  });
  const totalTypeViews = sum(byType.map((r) => r.value));
  const storyShare = totalTypeViews ? ((byType.find((r) => r.key === "STORY")?.value || 0) / totalTypeViews) * 100 : null;
  const storyNote =
    mediaCount === 0 && isNum(storyShare) && storyShare > 99
      ? "No tienes publicaciones en el feed: el 100% de tus vistas de los últimos 30 días viene de historias."
      : isNum(storyShare)
        ? `El ${storyShare.toFixed(0)}% de tus vistas de los últimos 30 días viene de historias.`
        : null;

  let posts;
  if (feed.length) {
    const counts = [isNum(mediaCount) ? `${nf.format(mediaCount)} publicaciones en tu perfil` : null, stories.length ? `${stories.length} ${stories.length === 1 ? "historia activa" : "historias activas"}` : null].filter(Boolean);
    posts = { state: "ready", subtitle: "Publicaciones recientes", items: feed, note: counts.length ? `${counts.join(" · ")}.` : null };
  }
  else if (stories.length) posts = { state: "ready", subtitle: "Historias activas · últimas 24 h", items: stories, note: storyNote };
  else if (!mediaEntry?.ok && !storiesEntry?.ok) posts = { state: "error", items: [], error: { code: "tool_error", message: mediaEntry?.error || storiesEntry?.error } };
  else
    posts = {
      state: "empty",
      items: [],
      message: mediaCount === 0 ? "No tienes publicaciones en el feed ni historias activas. Tus historias aparecen aquí mientras están publicadas (24 h)." : "No se encontraron publicaciones recientes.",
    };

  // Público
  const genderRows = insightBreakdown(okData(batch[B.gender]));
  const genderTotal = sum(genderRows.map((r) => r.value));
  const gender = genderTotal ? genderRows.map((r) => ({ label: GENDER_LABEL[r.key] || r.key, value: (r.value / genderTotal) * 100 })) : null;
  const ageRows = insightBreakdown(okData(batch[B.age]));
  const ageTotal = sum(ageRows.map((r) => r.value));
  const ages = ageTotal
    ? AGE_ORDER.map((a) => ({ label: `${a.replace("-", " a ")} años`, value: ((ageRows.find((r) => r.key === a)?.value || 0) / ageTotal) * 100 })).filter((r) => r.value > 0)
    : null;
  const countries = shareRows(insightBreakdown(okData(batch[B.country])), (code) => ({ code: String(code).toUpperCase(), label: countryName(String(code).toUpperCase()) }));
  const cities = shareRows(insightBreakdown(okData(batch[B.city])), (city) => ({ label: String(city) }));

  const secondary = isNum(net)
    ? {
        label: "Seguidores netos · 30 días",
        value: net,
        signed: true,
        note: `${formatNumber(followers, false)} seguidores en total · ${nf.format(follows || 0)} nuevos, ${nf.format(unfollows || 0)} se fueron`,
      }
    : { label: "Seguidores", value: followers, signed: false, note: "Seguidores de Instagram" };

  const viewsRatio = isNum(views) && isNum(prev.views) && prev.views > 0 ? views / prev.views : null;

  const name = conn.alias ? titleCase(conn.alias) : username;

  return {
    id: `ig-${user.id || conn.userId || username}`,
    name,
    handle: `@${username}`,
    initial: name.charAt(0).toUpperCase(),
    source: "live",
    storedAt: live.storedAt,
    periodLabel: "Últimos 30 días",
    rangeLabel,
    compareSuffix: "vs 30 días previos",
    hero: {
      badge: "Instagram",
      primary: { label: "Visualizaciones · 30 días", value: views, delta: viewsDelta },
      secondary,
      minis: [
        { icon: "radio", label: "Alcance", value: reach, delta: reachDelta, note: "cuentas únicas" },
        { icon: "heart", label: "Interacciones", value: interactions, delta: deltaOrNull(interactions, prev.total_interactions), note: "likes, respuestas y más" },
        { icon: "users", label: "Visitas al perfil", value: profileViews, delta: deltaOrNull(profileViews, prev.profile_views), note: "en 30 días" },
        { icon: "activity", label: "Engagement", value: rate, format: "percent", note: "interactuaron / alcance" },
      ],
    },
    milestone: {
      title: isNum(viewsRatio) && viewsRatio >= 2 ? `¡Multiplicaste tus vistas ×${viewsRatio.toFixed(1)}!` : isNum(viewsDelta) && viewsDelta > 0 ? "¡Tus vistas van para arriba!" : "Así van tus últimos 30 días",
      body: `Sumaste ${formatNumber(views, false)} vistas y llegaste a ${formatNumber(reach, false)} cuentas${isNum(reachDelta) ? ` (${signedPct(reachDelta, 0)} vs los 30 días anteriores)` : ""}. ${formatNumber(engaged, false)} cuentas interactuaron contigo y ${formatNumber(profileViews, false)} visitaron tu perfil.`,
      goal: isNum(followers) ? Math.ceil((followers + 1) / 100) * 100 : null,
    },
    seedNotes: [],
    followers,
    peak: hasSeries ? { title: "Día con más alcance", sub: `${tip[peakIdx]} · cuentas alcanzadas`, value: curVals[peakIdx] } : null,
    posts,
    audience: {
      subtitle: "Seguidores de Instagram · este mes",
      state: gender || countries || cities || ages ? "ready" : "empty",
      gender,
      locations: { countries, cities, ages },
    },
    charts: [
      {
        id: "30d",
        label: "30 días",
        subtitle: `Cuentas alcanzadas por día · ${rangeLabel}`,
        values: curVals,
        tipLabels: tip,
        axisLabels: cur.map((p, i) => (i % 7 === 0 ? dayMonth(p.ts) : "")),
        unit: "cuentas alcanzadas",
        total: reach,
        totalLabel: "cuentas alcanzadas en 30 días",
        delta: reachDelta,
        deltaSuffix: "vs 30 días previos",
        stats: [
          { label: "Promedio diario", value: hasSeries ? avg(curVals) : null },
          { label: "Día récord", value: hasSeries ? curVals[peakIdx] : null, sub: hasSeries ? tip[peakIdx] : "" },
        ],
        ariaLabel: `Cuentas alcanzadas por día en @${username}, ${rangeLabel}`,
      },
      {
        id: "60d",
        label: "60 días",
        subtitle: "Cuentas alcanzadas por día · últimos 60 días",
        values: bothVals,
        tipLabels: bothTip,
        axisLabels: both.map((p, i) => (i % 14 === 0 ? dayMonth(p.ts) : "")),
        unit: "cuentas alcanzadas",
        total: reach,
        totalLabel: "cuentas alcanzadas en los últimos 30 días",
        delta: reachDelta,
        deltaSuffix: "vs 30 días previos",
        stats: [
          { label: "30 días previos", value: prev.reach ?? null },
          { label: "Día récord", value: bothVals.length ? bothVals[bothPeak] : null, sub: bothVals.length ? bothTip[bothPeak] : "" },
        ],
        ariaLabel: `Cuentas alcanzadas por día en @${username}, últimos 60 días`,
      },
    ],
    buildInsights: () => instagramInsights({ both, byType, mediaCount, profileViews, follows, countries, cities, ages, rate, engaged, reach }),
    networks: [{ id: "instagram", label: "Instagram", icon: "camera", state: "ready", text: `${formatNumber(followers, false)} seguidores · ${formatNumber(views)} vistas en 30 días` }],
  };
}

function instagramInsights({ both, byType, mediaCount, profileViews, follows, countries, cities, ages, rate, engaged, reach }) {
  const out = [];
  const typeTotal = sum(byType.map((r) => r.value));
  if (typeTotal > 0) {
    const top = [...byType].sort((a, b) => b.value - a.value)[0];
    const label = PRODUCT_LABEL[top.key] || String(top.key).toLowerCase();
    const reelShare = ((byType.find((r) => r.key === "REEL")?.value || 0) / typeTotal) * 100;
    let action = "Mantén ese formato y prueba hooks nuevos con Trial Reels.";
    if (top.key === "STORY") action = "Sube 2 o 3 reels por semana: las historias solo las ven tus seguidores y los reels llegan a gente nueva.";
    else if (reelShare < 10) action = `Solo el ${reelShare.toFixed(0)}% de tus vistas vino de reels: sube 2 por semana para llegar a gente que aún no te sigue.`;
    out.push({
      id: "format",
      icon: "play",
      label: "De dónde vienen tus vistas",
      stat: `${((top.value / typeTotal) * 100).toFixed(0)}%`,
      text: `de tus vistas de los últimos 30 días vino de ${label}.${mediaCount === 0 ? " No tienes publicaciones en el feed." : ""}`,
      action,
    });
  }
  if (both.length >= 14) {
    const weekday = weekdayAveragesFrom(both.map((p) => [p.ts, p.value]));
    const best = argmax(weekday.map((v) => (isNum(v) ? v : -Infinity)));
    const worst = argmin(weekday.map((v) => (isNum(v) ? v : Infinity)));
    if (isNum(weekday[best]) && weekday[best] > 0) {
      const lift = isNum(weekday[worst]) && weekday[worst] > 0 ? `, ${pctChange(weekday[best], weekday[worst]).toFixed(0)}% más que los ${WEEKDAYS[worst]}` : "";
      out.push({
        id: "weekday",
        icon: "calendar",
        label: "Tu mejor día",
        stat: capitalize(WEEKDAYS[best]),
        text: `Los ${WEEKDAYS[best]} llegas en promedio a ${nf.format(Math.round(weekday[best]))} cuentas${lift} (últimos 60 días).`,
        action: `Publica tu contenido más fuerte los ${WEEKDAYS[best]}.`,
      });
    }
  }
  if (isNum(profileViews) && profileViews > 0 && isNum(follows)) {
    out.push({
      id: "conversion",
      icon: "target",
      label: "Visitas que te siguen",
      stat: `${((follows / profileViews) * 100).toFixed(0)}%`,
      text: `De ${nf.format(profileViews)} visitas a tu perfil, ${nf.format(follows)} terminaron en seguidores nuevos.`,
      action: "Afina tu bio y fija historias destacadas que expliquen de qué va tu cuenta.",
    });
  } else if (isNum(rate)) {
    out.push({
      id: "rate",
      icon: "users",
      label: "Tasa de interacción",
      stat: `${rate.toFixed(1)}%`,
      text: `De cada 100 cuentas que te vieron, ${Math.round(rate)} interactuaron (${nf.format(engaged)} de ${nf.format(reach)}).`,
      action: "Usa stickers de pregunta y encuestas para subirla.",
    });
  }
  if (countries && countries.length) {
    const topCities = cities ? cities.slice(0, 2) : [];
    const citiesShare = sum(topCities.map((c) => c.value));
    const young = ages ? sum(ages.filter((a) => /^(18|25)/.test(a.label)).map((a) => a.value)) : null;
    out.push({
      id: "audience",
      icon: "pin",
      label: "Tu público",
      stat: `${countries[0].value.toFixed(0)}%`,
      text: `de tus seguidores está en ${countries[0].label}${topCities.length ? `; el ${citiesShare.toFixed(0)}% en ${topCities.map((c) => c.label.split(",")[0]).join(" y ")}` : ""}${isNum(young) && young > 0 ? `, y el ${young.toFixed(0)}% tiene entre 18 y 34 años` : ""}.`,
      action: topCities.length ? `Usa referencias locales de ${topCities[0].label.split(",")[0]} y fechas como Día de Muertos.` : "Aprovecha fechas locales como Día de Muertos.",
    });
  }
  return out.slice(0, 4);
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useAnimatedNumber(target, duration = 650) {
  const safe = isNum(target) ? target : 0;
  const [value, setValue] = useState(safe);
  const fromRef = useRef(safe);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    if (reduce || from === safe) {
      fromRef.current = safe;
      setValue(safe);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (safe - from) * (1 - Math.pow(1 - p, 3));
      fromRef.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [safe, duration]);
  return isNum(target) ? value : null;
}

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (s.width === r.width && s.height === r.height ? s : { width: r.width, height: r.height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

// Resuelve la capability `mcp`. Fuera de claude.ai no existe y se usan los datos de ejemplo.
function useMcpCapability() {
  const available = typeof window !== "undefined" && window.claude && typeof window.claude.use === "function";
  const [state, setState] = useState(available ? { status: "connecting", api: null } : { status: "absent", api: null });
  useEffect(() => {
    if (!available) return undefined;
    let alive = true;
    window.claude.use("mcp").then(
      (api) => alive && setState(api ? { status: "ready", api } : { status: "absent", api: null }),
      () => alive && setState({ status: "absent", api: null })
    );
    return () => {
      alive = false;
    };
  }, [available]);
  return state;
}

// Lee Instagram por Composio:
//   1. descubre las cuentas conectadas (si falla, usa la cuenta predeterminada),
//   2. una llamada con todas las métricas de todas las cuentas,
//   3. otra con las métricas de los posts recientes y las historias activas de cada cuenta.
function useInstagramLive(api) {
  const [state, setState] = useState({ status: api ? "loading" : "idle" });
  const [nonce, setNonce] = useState(0);
  const forceRef = useRef(false);

  useEffect(() => {
    if (!api) return undefined;
    let alive = true;
    const force = forceRef.current;
    forceRef.current = false;
    setState((s) => (s.accounts ? { ...s, refreshing: true } : { status: "loading" }));
    const options = { cache: { ...CACHE_OPTIONS, ...(force ? { refresh: true } : {}) } };
    const run = (tools) => api.callTool(CP_SERVER, CP_TOOL, { tools, sync_response_to_workbench: false, thought: "Leer analíticas de Instagram para el dashboard" }, options);
    // Varias llamadas cuando no caben en una; el resultado se une en el mismo orden
    const runAll = async (tools) => {
      const groups = chunk(tools, MAX_BATCH_ITEMS);
      const parts = await Promise.all(groups.map(run));
      const entries = groups.flatMap((group, gi) => {
        const parsed = parseBatch(parts[gi]);
        return group.map((_, i) => parsed[i]);
      });
      return { entries, first: parts[0] };
    };

    (async () => {
      try {
        let conns = [];
        try {
          conns = parseConnections(await api.callTool(CP_SERVER, CP_CONNECTIONS, { toolkits: [{ name: "instagram", action: "list" }] }, options));
        } catch (err) {
          if (RETRACT_CODES.has(err?.code)) throw err;
          /* sin lista de cuentas: se lee la cuenta predeterminada */
        }
        const targets = conns.length ? conns : [null];

        const w = instagramWindows();
        const main = await runAll(targets.flatMap((c) => instagramBatch(w, c?.id)));
        const accounts = targets.map((conn, i) => ({ conn, batch: main.entries.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE) }));

        // Métricas individuales: posts recientes del feed e historias activas
        const mediaCalls = [];
        accounts.forEach((acc, ai) => {
          const feed = listOf(okData(acc.batch[B.media])).filter((m) => m && m.id).slice(0, MEDIA_INSIGHTS_PER_ACCOUNT);
          const stories = listOf(okData(acc.batch[B.stories])).filter((s) => s && s.id).slice(0, MEDIA_INSIGHTS_PER_ACCOUNT);
          feed.forEach((m) => mediaCalls.push({ ai, id: m.id, metric: FEED_METRICS }));
          stories.forEach((s) => mediaCalls.push({ ai, id: s.id, metric: STORY_METRICS }));
        });
        accounts.forEach((acc) => {
          acc.mediaInsights = {};
        });
        if (mediaCalls.length) {
          try {
            const res = await runAll(
              mediaCalls.map((c) => {
                const account = targets[c.ai]?.id;
                const item = { tool_slug: "INSTAGRAM_GET_IG_MEDIA_INSIGHTS", arguments: { ig_media_id: c.id, metric: c.metric } };
                return account ? { ...item, account } : item;
              })
            );
            mediaCalls.forEach((c, i) => {
              accounts[c.ai].mediaInsights[c.id] = insightTotals(okData(res.entries[i]));
            });
          } catch {
            /* sin métricas por publicación: se muestran sin vistas */
          }
        }

        if (alive) setState({ status: "ready", accounts, storedAt: main.first?.cache?.storedAt ?? Date.now() });
      } catch (err) {
        const error = err && err.code ? err : { code: "upstream_error", message: String(err?.message || "") };
        if (alive) setState((s) => (s.accounts && !RETRACT_CODES.has(error.code) ? { ...s, refreshing: false, staleError: error } : { status: "error", error }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [api, nonce]);

  const refresh = useCallback(() => {
    forceRef.current = true;
    setNonce((n) => n + 1);
  }, []);
  return [state, refresh];
}

// Mantiene al día el resultado de una herramienta de Metricool (repite caché y refresca solo)
function useMetricoolWatch(api, tool, input) {
  const key = api && input ? JSON.stringify(input) : null;
  const [state, setState] = useState({ status: key ? "loading" : "idle" });
  useEffect(() => {
    if (!key) {
      setState({ status: "idle" });
      return undefined;
    }
    setState((s) => (s.data !== undefined ? s : { status: "loading" }));
    const unsubscribe = api.watchTool(
      MC_SERVER,
      tool,
      JSON.parse(key),
      (ev) => {
        if (ev.type === "data") {
          setState({ status: "ready", data: ev.result.payload, storedAt: ev.result.cache?.storedAt ?? Date.now() });
        } else {
          const error = ev.error || { code: "upstream_error", message: "" };
          setState((s) => (RETRACT_CODES.has(error.code) || s.data === undefined ? { status: "error", error } : { ...s, staleError: error }));
        }
      },
      { cache: CACHE_OPTIONS }
    );
    return unsubscribe;
  }, [api, tool, key]);
  return state;
}

// TikTok desde Metricool; solo consulta cuando `enabled` (el visitante lo pidió o ya dio permiso)
function useTikTok(api, enabled) {
  const brands = useMetricoolWatch(api, MC_BRANDS, api && enabled ? {} : null);
  const list = Array.isArray(brands.data?.data) ? brands.data.data : [];
  const brand = list.find((b) => b && b.networksData?.tiktokData) || null;
  const timeZone = brand?.timezone || "America/Mexico_City";
  const window30 = useMemo(() => (brand ? metricoolWindow(timeZone) : null), [brand?.id, timeZone]); // eslint-disable-line react-hooks/exhaustive-deps
  const tk = useMetricoolWatch(api, MC_DATA, brand && window30 ? { brandId: String(brand.id), from: window30.from, to: window30.to, metrics: TK_EVOLUTION } : null);

  if (!enabled) return { state: "idle" };
  if (brands.status === "error") return { state: "error", error: brands.error };
  if (brands.status !== "ready") return { state: "loading" };
  if (!brand) return { state: "none" };
  // Instagram de la misma marca en Metricool: el TikTok solo se muestra junto a esa cuenta
  const igHandle = brand.networksData?.instagramData ? `@${String(brand.networksData.instagramData).toLowerCase()}` : null;
  if (tk.status === "error") return { state: "error", error: tk.error, igHandle };
  if (tk.status !== "ready") return { state: "loading", igHandle };

  const byDay = new Map();
  (Array.isArray(tk.data?.rows) ? tk.data.rows : []).forEach((row) => {
    if (!Array.isArray(row) || row[TK_EVOLUTION.length] == null) return;
    const values = {};
    TK_EVOLUTION.forEach((m, i) => {
      values[m] = toNum(row[i]);
    });
    byDay.set(String(row[TK_EVOLUTION.length]), values);
  });
  const series = (metric) => window30.days.map((ts) => byDay.get(tsToKey(ts))?.[metric] ?? null);
  const latest = [...byDay.keys()].sort().reverse().map((k) => byDay.get(k).TKEV07).find(isNum) ?? null;
  const views = sumNullable(series("TKEV02"));
  const interactions = sumNullable(series("TKEV06"));
  const hasData = [latest, views, interactions].some((v) => isNum(v) && v > 0);
  return hasData ? { state: "ready", followers: latest, views, interactions, igHandle } : { state: "syncing", igHandle };
}

/* ------------------------------------------------------------------ */
/*  Íconos (outline, estilo Lucide)                                    */
/* ------------------------------------------------------------------ */

const ICONS = {
  plus: (<><path d="M5 12h14" /><path d="M12 5v14" /></>),
  x: (<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>),
  check: <path d="M20 6 9 17l-5-5" />,
  pencil: (<><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></>),
  sliders: (<><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>),
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  eye: (<><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></>),
  heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
  play: <path d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z" />,
  copy: (<><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>),
  image: (<><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>),
  trending: (<><path d="M22 7 13.5 15.5 8.5 10.5 2 17" /><path d="M16 7h6v6" /></>),
  arrowUp: (<><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>),
  arrowDown: (<><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></>),
  users: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  target: (<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>),
  flag: (<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" /></>),
  zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  pin: (<><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>),
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  radio: (<><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" /></>),
  note: (<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8" /><path d="M16 17H8" /></>),
  bulb: (<><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>),
  send: (<><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></>),
  repeat: (<><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>),
  refresh: (<><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>),
  search: (<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
  flask: (<><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></>),
  calendar: (<><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>),
  sparkles: <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />,
  music: (<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
  camera: (<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>),
  message: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  megaphone: (<><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>),
  bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />,
  alert: (<><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></>),
};

function Icon({ name, className = "h-4 w-4", strokeWidth = 1.75 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Tema: todos los colores salen de variables CSS (ver GLOBAL_CSS)    */
/* ------------------------------------------------------------------ */

const INK = "text-[color:var(--ink)]";
const INK2 = "text-[color:var(--ink-2)]";
const MUTED = "text-[color:var(--muted)]";
const FAINT = "text-[color:var(--faint)]";
const CARD_BG = "bg-[color:var(--card)]";
const FILL = "bg-[color:var(--fill)]";
const FILL2 = "bg-[color:var(--fill-2)]";
const DASH = "border-[color:var(--dash)]";
const ACCENT = "bg-[color:var(--accent)] text-[color:var(--on-accent)]";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--faint)]";
const FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";
const CHIP_BTN = `bg-[color:var(--card)] text-[color:var(--ink)] hover:bg-[color:var(--hover)] ig-shadow`;
const INPUT =
  "mt-1.5 w-full rounded-2xl border border-transparent bg-[color:var(--fill)] px-3.5 py-2.5 text-[15px] text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--faint)] focus:border-[color:var(--dash)] focus:bg-[color:var(--card)]";

function formatStat(value, format, compact) {
  if (!isNum(value)) return "—";
  if (format === "percent") return `${value.toFixed(1)}%`;
  if (format === "signedPercent") return signedPct(value);
  return formatNumber(value, compact);
}

/* ------------------------------------------------------------------ */
/*  Piezas base                                                        */
/* ------------------------------------------------------------------ */

function Card({ hero = false, className = "", children }) {
  const skin = hero ? "bg-[color:var(--hero)] text-[color:var(--hero-ink)] ig-shadow-hero" : `${CARD_BG} ${INK} ig-shadow`;
  return <section className={`flex flex-col rounded-[28px] p-6 sm:p-7 ${skin} ${className}`}>{children}</section>;
}

function CardHeader({ title, subtitle, right, hero = false }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className={`text-[17px] font-semibold tracking-[-0.01em] ${hero ? "text-[color:var(--hero-ink)]" : INK}`}>{title}</h2>
        {subtitle && <p className={`mt-0.5 text-[13px] ${hero ? "text-[color:var(--hero-sub)]" : MUTED}`}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function IconBadge({ icon }) {
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${FILL} ${INK2}`}>
      <Icon name={icon} className="h-[17px] w-[17px]" />
    </span>
  );
}

function EmptyState({ icon = "alert", title, children }) {
  return (
    <div className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-[22px] border border-dashed px-5 py-8 text-center ${DASH}`}>
      <span className={`grid h-10 w-10 place-items-center rounded-full ${FILL} ${INK2}`}>
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      {children && <p className={`max-w-[34ch] text-[13px] leading-relaxed ${MUTED}`}>{children}</p>}
    </div>
  );
}

function Segmented({ options, value, onChange, label, small = false }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex shrink-0 items-center rounded-full bg-[color:var(--track)] p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ${FOCUS} ${
              small ? "px-3 py-1 text-xs" : "py-1.5 pl-1.5 pr-4 text-sm"
            } ${active ? `bg-[color:var(--seg)] ${INK} ig-shadow-seg` : `${INK2} hover:text-[color:var(--ink)]`}`}
          >
            {o.render ? o.render(active) : o.label}
          </button>
        );
      })}
    </div>
  );
}

function Switch({ checked, onChange, id, label }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${FOCUS} ${checked ? "bg-[color:var(--accent)]" : "bg-[color:var(--axis)]"}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${
          checked ? "translate-x-4 bg-[color:var(--on-accent)]" : "translate-x-0 bg-[color:var(--knob-off)]"
        }`}
      />
    </button>
  );
}

function DeltaPill({ value, suffix, onHero = false, className = "" }) {
  if (!isNum(value)) return null;
  const up = value >= 0;
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
          onHero ? "bg-[color:var(--hero-chip)] text-[color:var(--hero-ink)]" : `${FILL} ${INK}`
        }`}
      >
        <Icon name={up ? "arrowUp" : "arrowDown"} className="h-3 w-3" strokeWidth={2.25} />
        {signedPct(value)}
      </span>
      {suffix && <span className={`text-xs ${onHero ? "text-[color:var(--hero-faint)]" : MUTED}`}>{suffix}</span>}
    </div>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-[color:var(--line)] ${className}`}>
      <div className="h-full rounded-full bg-[color:var(--accent)] transition-[width] duration-500 ease-out" style={{ width: `${clamp(value, 0, 100)}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Barra superior y estado de la conexión                             */
/* ------------------------------------------------------------------ */

function SettingsMenu({ prefs, setPrefs, compareLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Ajustes"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`grid h-9 w-9 place-items-center rounded-full transition ${FOCUS} ${open ? ACCENT : CHIP_BTN}`}
      >
        <Icon name="sliders" className="h-[17px] w-[17px]" />
      </button>
      {open && (
        <div role="dialog" aria-label="Ajustes de visualización" className={`ig-pop ig-shadow-pop absolute right-0 top-11 z-30 w-72 rounded-3xl p-4 ${CARD_BG} ${INK}`}>
          <p className="text-[15px] font-semibold">Ajustes</p>
          <p className={`mt-4 text-xs font-medium ${MUTED}`}>Formato de números</p>
          <div className="mt-2">
            <Segmented
              small
              label="Formato de números"
              value={prefs.compact ? "compact" : "full"}
              onChange={(v) => setPrefs((p) => ({ ...p, compact: v === "compact" }))}
              options={[
                { value: "compact", label: "Abreviado · 1.8M" },
                { value: "full", label: "Completo" },
              ]}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[color:var(--sep)] pt-4">
            <label htmlFor="pref-compare" className="min-w-0 cursor-pointer">
              <span className="block text-sm font-medium">Comparar con el periodo anterior</span>
              <span className={`block text-xs ${MUTED}`}>Muestra el cambio {compareLabel}</span>
            </label>
            <Switch id="pref-compare" checked={prefs.compare} onChange={(v) => setPrefs((p) => ({ ...p, compare: v }))} />
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar({ accounts, accountId, onSelect, editing, onToggleEdit, prefs, setPrefs, theme, onToggleTheme, compareLabel, showSampleTags }) {
  const dark = theme === "dark";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="-mx-1 max-w-full overflow-x-auto px-1 py-1">
        <Segmented
          label="Cuenta"
          value={accountId}
          onChange={onSelect}
          options={accounts.map((a) => ({
            value: a.id,
            render: (active) => (
              <>
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold transition-colors ${active ? ACCENT : `${CARD_BG} ${INK2}`}`}>{a.initial}</span>
                {a.name}
                {showSampleTags && a.source === "sample" && <span className={`rounded-full border border-dashed px-1.5 text-[10px] font-medium ${DASH} ${MUTED}`}>ejemplo</span>}
              </>
            ),
          }))}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          title={dark ? "Tema claro" : "Tema oscuro"}
          className={`grid h-9 w-9 place-items-center rounded-full transition ${FOCUS} ${CHIP_BTN}`}
        >
          <Icon name={dark ? "sun" : "moon"} className="h-[17px] w-[17px]" />
        </button>
        <button
          type="button"
          onClick={onToggleEdit}
          aria-pressed={editing}
          className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition ${FOCUS} ${editing ? ACCENT : CHIP_BTN}`}
        >
          <Icon name={editing ? "check" : "pencil"} className="h-[15px] w-[15px]" />
          {editing ? "Listo" : "Editar"}
        </button>
        <SettingsMenu prefs={prefs} setPrefs={setPrefs} compareLabel={compareLabel} />
      </div>
    </div>
  );
}

function SourceChip({ kind }) {
  if (kind === "live") {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${ACCENT}`}>
        <span className="ig-pulse h-1.5 w-1.5 rounded-full bg-[color:var(--on-accent)]" />
        En vivo · Instagram
      </span>
    );
  }
  return (
    <span className={`rounded-full border border-dashed px-2.5 py-0.5 text-xs ${DASH} ${MUTED}`}>{kind === "connecting" ? "Conectando con Instagram…" : "Datos de ejemplo"}</span>
  );
}

function Banner({ icon = "alert", children, action }) {
  return (
    <div className={`ig-fade ig-shadow mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${CARD_BG} ${INK2}`}>
      <span className="flex min-w-0 items-start gap-2">
        <Icon name={icon} className={`mt-0.5 h-4 w-4 shrink-0 ${INK}`} />
        <span className="min-w-0">{children}</span>
      </span>
      {action}
    </div>
  );
}

function NetworkChip({ icon, label, active, children }) {
  return (
    <span className={`ig-shadow inline-flex max-w-full items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-[13px] ${CARD_BG}`}>
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${active ? ACCENT : `${FILL} ${INK2}`}`}>
        <Icon name={icon} className="h-3.5 w-3.5" />
      </span>
      <span className="font-semibold">{label}</span>
      {children}
    </span>
  );
}

function LiveStrip({ acc, tiktok, onConnectTikTok, onRefresh, refreshing }) {
  const time = acc.storedAt ? new Date(acc.storedAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {acc.networks.map((n) => (
        <NetworkChip key={n.id} icon={n.icon} label={n.label} active={n.state === "ready"}>
          <span className={`min-w-0 truncate ${INK2}`}>{n.text}</span>
        </NetworkChip>
      ))}
      {tiktok.state !== "none" && (!tiktok.igHandle || tiktok.igHandle === acc.handle.toLowerCase()) && (
        <NetworkChip icon="music" label="TikTok" active={tiktok.state === "ready"}>
          {tiktok.state === "idle" ? (
            <button type="button" onClick={onConnectTikTok} className={`rounded-full text-[13px] font-medium underline underline-offset-2 ${INK2} hover:text-[color:var(--ink)] ${FOCUS}`}>
              Cargar desde Metricool
            </button>
          ) : (
            <span className={`min-w-0 truncate ${tiktok.state === "ready" ? INK2 : MUTED}`}>
              {tiktok.state === "ready"
                ? `${formatNumber(tiktok.followers, false)} seguidores · ${formatNumber(tiktok.views)} vistas en 30 días`
                : tiktok.state === "syncing"
                  ? "Metricool todavía está sincronizando tus datos"
                  : tiktok.state === "error"
                    ? errorCopy(tiktok.error, "Metricool")
                    : "Cargando…"}
            </span>
          )}
        </NetworkChip>
      )}
      <span className={`ml-auto flex items-center gap-2 text-xs ${MUTED}`}>
        {time && <span>Actualizado a las {time}</span>}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition disabled:opacity-50 ${FOCUS} ${CHIP_BTN}`}
        >
          <Icon name="refresh" className={`h-3.5 w-3.5 ${refreshing ? "ig-spin" : ""}`} />
          {refreshing ? "Actualizando…" : "Actualizar"}
        </button>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta 1 · Resumen (contraste invertido)                          */
/* ------------------------------------------------------------------ */

function MiniStat({ icon, label, value, delta, note }) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl bg-[color:var(--hero-box)] p-3.5">
      <div className="flex items-center gap-1.5 text-[color:var(--hero-sub)]">
        <Icon name={icon} className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[color:var(--hero-ink)]">{value}</p>
      {isNum(delta) ? (
        <p className="mt-0.5 flex items-center gap-0.5 text-xs tabular-nums text-[color:var(--hero-sub)]">
          <Icon name={delta >= 0 ? "arrowUp" : "arrowDown"} className="h-3 w-3" strokeWidth={2.25} />
          {signedPct(delta)}
        </p>
      ) : (
        <p className="mt-0.5 truncate text-xs text-[color:var(--hero-faint)]">{note}</p>
      )}
    </div>
  );
}

function HeroCard({ acc, prefs }) {
  const { primary, secondary, minis } = acc.hero;
  const primaryAnim = useAnimatedNumber(primary.value);
  const secondaryAnim = useAnimatedNumber(secondary.value);
  const primaryText = formatNumber(primaryAnim, prefs.compact);
  const secondaryText = isNum(secondaryAnim) ? `${secondary.signed ? (secondaryAnim >= 0 ? "+" : "−") : ""}${nf.format(Math.abs(Math.round(secondaryAnim)))}` : "—";

  return (
    <Card hero>
      <CardHeader
        hero
        title="Resumen"
        subtitle={`${acc.periodLabel} · ${acc.handle}`}
        right={<span className="rounded-full bg-[color:var(--hero-chip)] px-2.5 py-1 text-xs font-medium text-[color:var(--hero-sub)]">{acc.hero.badge}</span>}
      />

      <div className="mt-8">
        <p className="text-[13px] font-medium text-[color:var(--hero-sub)]">{primary.label}</p>
        <p className={`mt-1.5 font-bold leading-none tracking-[-0.04em] ${primaryText.length > 7 ? "text-[2.6rem]" : "text-[3.5rem]"}`}>{primaryText}</p>
        {prefs.compare && <DeltaPill onHero className="mt-3" value={primary.delta} suffix={acc.compareSuffix} />}
      </div>

      <div className="mt-7">
        <p className="text-[13px] font-medium text-[color:var(--hero-sub)]">{secondary.label}</p>
        <p className="mt-1.5 text-[2.6rem] font-bold leading-none tracking-[-0.04em]">{secondaryText}</p>
        {secondary.note && <p className="mt-2.5 text-[13px] leading-snug text-[color:var(--hero-faint)]">{secondary.note}</p>}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2.5 pt-8">
        {minis.map((m) => (
          <MiniStat key={m.label} icon={m.icon} label={m.label} value={formatStat(m.value, m.format, prefs.compact)} delta={prefs.compare ? m.delta : null} note={m.note} />
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta 2 · Hitos del Mes                                          */
/* ------------------------------------------------------------------ */

function ListRow({ icon, title, subtitle, right, children }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${FILL} ${INK2}`}>
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-[15px] font-medium">{title}</p>
          {right && <div className="shrink-0 text-right text-[15px] font-semibold tabular-nums">{right}</div>}
        </div>
        {subtitle && <p className={`truncate text-[13px] ${MUTED}`}>{subtitle}</p>}
        {children}
      </div>
    </li>
  );
}

function MilestonesCard({ acc, editing, milestone, onMilestoneChange, onMilestoneReset, notes, onAddNote, onDeleteNote }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setAdding(false);
    setDraft("");
  }, [acc.id]);

  const goal = Number(milestone.goal) || acc.milestone.goal;
  const hasGoal = isNum(acc.followers) && isNum(goal) && goal > 0;
  const progress = hasGoal ? (acc.followers / goal) * 100 : 0;
  const remaining = hasGoal ? Math.max(0, goal - acc.followers) : 0;

  const save = () => {
    const text = draft.trim();
    if (!text) return;
    onAddNote(text);
    setDraft("");
    setAdding(false);
  };
  const cancel = () => {
    setDraft("");
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader title="Hitos del Mes" subtitle={acc.periodLabel} right={<IconBadge icon="flag" />} />

      <div key={acc.id} className="ig-fade">
        {editing ? (
          <div className="mt-5 space-y-3">
            <label className="block" htmlFor={`ms-title-${acc.id}`}>
              <span className={`text-xs font-medium ${MUTED}`}>Titular</span>
              <input id={`ms-title-${acc.id}`} className={INPUT} value={milestone.title} onChange={(e) => onMilestoneChange({ title: e.target.value })} />
            </label>
            <label className="block" htmlFor={`ms-body-${acc.id}`}>
              <span className={`text-xs font-medium ${MUTED}`}>Resumen</span>
              <textarea id={`ms-body-${acc.id}`} rows={3} className={`${INPUT} resize-none leading-relaxed`} value={milestone.body} onChange={(e) => onMilestoneChange({ body: e.target.value })} />
            </label>
            <label className="block" htmlFor={`ms-goal-${acc.id}`}>
              <span className={`text-xs font-medium ${MUTED}`}>Meta de seguidores</span>
              <input id={`ms-goal-${acc.id}`} type="number" min="1" step="100" inputMode="numeric" className={`${INPUT} tabular-nums`} value={milestone.goal ?? ""} onChange={(e) => onMilestoneChange({ goal: e.target.value })} />
            </label>
            <button type="button" onClick={onMilestoneReset} className={`rounded-full px-1 text-xs font-medium underline-offset-2 hover:underline ${MUTED} hover:text-[color:var(--ink)] ${FOCUS}`}>
              Restablecer texto original
            </button>
          </div>
        ) : (
          <>
            <h3 className="mt-5 text-balance text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]">{milestone.title}</h3>
            {milestone.body && <p className={`mt-2 text-[15px] leading-relaxed ${INK2}`}>{milestone.body}</p>}
          </>
        )}

        {(acc.peak || hasGoal) && (
          <ul className="mt-4 divide-y divide-[color:var(--sep)]">
            {acc.peak && <ListRow icon="zap" title={acc.peak.title} subtitle={acc.peak.sub} right={nf.format(acc.peak.value)} />}
            {hasGoal && (
              <ListRow icon="target" title="Meta de seguidores" subtitle={remaining > 0 ? `Faltan ${nf.format(remaining)} para ${nf.format(goal)}` : `Meta de ${nf.format(goal)} cumplida`} right={`${Math.min(100, progress).toFixed(0)}%`}>
                <ProgressBar value={progress} className="mt-2" />
              </ListRow>
            )}
          </ul>
        )}
      </div>

      {notes.length > 0 && (
        <div className="mt-4">
          <p className={EYEBROW}>Notas de campaña</p>
          <ul className="mt-2 space-y-2">
            {notes.map((n) => (
              <li key={n.id} className={`ig-fade flex items-start gap-3 rounded-2xl px-3.5 py-3 ${FILL2}`}>
                <Icon name="note" className={`mt-0.5 h-4 w-4 shrink-0 ${MUTED}`} />
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm leading-snug">{n.text}</p>
                  <p className={`mt-1 text-xs ${MUTED}`}>{n.date}</p>
                </div>
                {editing && (
                  <button
                    type="button"
                    onClick={() => onDeleteNote(n.id)}
                    aria-label={`Eliminar nota: ${n.text}`}
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${CARD_BG} ${INK2} hover:text-[color:var(--ink)] ig-shadow ${FOCUS}`}
                  >
                    <Icon name="x" className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-4">
        {adding ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className={`ig-fade rounded-2xl border border-dashed p-3 ${DASH}`}
          >
            <label htmlFor={`note-${acc.id}`} className="sr-only">
              Nota de campaña
            </label>
            <textarea
              id={`note-${acc.id}`}
              autoFocus
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  save();
                }
                if (e.key === "Escape") cancel();
              }}
              placeholder="Ej. Colaboración con una marca, 3 reels patrocinados"
              className={`w-full resize-none bg-transparent px-1 text-sm leading-snug outline-none placeholder:text-[color:var(--faint)] ${INK}`}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={cancel} className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition hover:bg-[color:var(--fill)] ${INK2} ${FOCUS}`}>
                Cancelar
              </button>
              <button type="submit" disabled={!draft.trim()} className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition disabled:opacity-30 ${ACCENT} ${FOCUS}`}>
                Guardar nota
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed bg-transparent px-4 py-3.5 text-sm font-medium transition hover:border-[color:var(--dash-hover)] hover:bg-[color:var(--hover)] hover:text-[color:var(--ink)] ${DASH} ${INK2} ${FOCUS}`}
          >
            <Icon name="plus" className="h-4 w-4" strokeWidth={2} />
            Agregar nota de campaña
          </button>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta 3 · Rendimiento de contenido                               */
/* ------------------------------------------------------------------ */

function ContentCard({ acc, prefs }) {
  const [sort, setSort] = useState("recent");
  const { posts } = acc;
  const items = useMemo(
    () => [...posts.items].sort((a, b) => (sort === "recent" ? b.ts - a.ts : (b.primary ?? -1) - (a.primary ?? -1))).slice(0, 4),
    [posts.items, sort]
  );

  return (
    <Card>
      <CardHeader
        title="Rendimiento de contenido"
        subtitle={posts.subtitle || "Publicaciones recientes"}
        right={
          posts.state === "ready" && posts.items.length > 1 ? (
            <Segmented
              small
              label="Ordenar contenido"
              value={sort}
              onChange={setSort}
              options={[
                { value: "recent", label: "Recientes" },
                { value: "top", label: "Más vistas" },
              ]}
            />
          ) : null
        }
      />

      {posts.state === "ready" && (
        <>
          <ul key={`${acc.id}-${sort}`} className="ig-fade mt-3 divide-y divide-[color:var(--sep)]">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-3.5 py-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px]" style={{ background: p.tone }} aria-hidden="true">
                  <Icon name={p.icon} className="h-[18px] w-[18px] text-white/90" />
                </div>
                <div className="min-w-0 flex-1">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={`line-clamp-2 break-words rounded text-[15px] font-medium leading-snug underline-offset-2 hover:underline ${FOCUS}`}>
                      {p.title}
                    </a>
                  ) : (
                    <p className="line-clamp-2 break-words text-[15px] font-medium leading-snug">{p.title}</p>
                  )}
                  <p className={`mt-0.5 text-[13px] ${MUTED}`}>
                    {TYPE_LABEL[p.type]}
                    {p.dateLabel && ` · ${p.dateLabel}`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="flex items-center justify-end gap-1 text-[15px] font-semibold tabular-nums">
                    <Icon name="eye" className={`h-3.5 w-3.5 ${FAINT}`} />
                    <span className="sr-only">Vistas:</span>
                    {formatNumber(p.primary, prefs.compact)}
                  </p>
                  <p className={`mt-0.5 flex items-center justify-end gap-1 text-[13px] tabular-nums ${MUTED}`}>
                    <Icon name={p.secondary.icon} className={`h-3.5 w-3.5 ${FAINT}`} />
                    <span className="sr-only">{p.secondary.label}:</span>
                    {formatNumber(p.secondary.value, prefs.compact)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {posts.note && (
            <div className="mt-auto pt-3">
              <p className={`rounded-2xl px-4 py-3 text-[13px] leading-snug ${FILL2} ${INK2}`}>{posts.note}</p>
            </div>
          )}
        </>
      )}

      {posts.state === "empty" && (
        <div className="mt-4 flex flex-1 flex-col">
          <EmptyState icon="image" title="Nada publicado por ahora">{posts.message}</EmptyState>
        </div>
      )}
      {posts.state === "error" && (
        <div className="mt-4 flex flex-1 flex-col">
          <EmptyState icon="alert" title="No se pudo leer tu contenido">{errorCopy(posts.error)}</EmptyState>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta 4 · Público                                                */
/* ------------------------------------------------------------------ */

const GENDER_TONES = ["bg-[color:var(--accent)]", "bg-[color:var(--bar-2)]", "bg-[color:var(--dash)]"];
const LOCATION_LABELS = { countries: "Países", cities: "Ciudades", ages: "Edades" };

function AudienceCard({ acc }) {
  const { audience } = acc;
  const available = Object.keys(LOCATION_LABELS).filter((k) => audience.locations?.[k]?.length);
  const [view, setView] = useState("countries");
  const current = available.includes(view) ? view : available[0];
  const rows = current ? audience.locations[current] : [];
  const gender = audience.gender ? [...audience.gender].sort((a, b) => b.value - a.value) : null;

  return (
    <Card>
      <CardHeader title="Público" subtitle={audience.subtitle} right={<IconBadge icon="users" />} />

      {!gender && !available.length ? (
        <div className="mt-5 flex flex-1 flex-col">
          <EmptyState icon="users" title="Sin datos de público todavía">Instagram muestra la demografía cuando la cuenta pasa de 100 seguidores.</EmptyState>
        </div>
      ) : (
        <>
          {gender && (
            <div key={acc.id} className="ig-fade mt-6">
              <p className={EYEBROW}>Género</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                {gender.map((g, i) => (
                  <div key={g.label} className={`min-w-0 ${i === 0 ? "" : i === gender.length - 1 ? "text-right" : "text-center"}`}>
                    <p className={`flex items-center gap-1.5 text-[13px] ${MUTED} ${i === 0 ? "" : i === gender.length - 1 ? "justify-end" : "justify-center"}`}>
                      <span className={`h-2 w-2 shrink-0 rounded-full ${GENDER_TONES[i] || GENDER_TONES[2]}`} />
                      <span className="truncate">{g.label}</span>
                    </p>
                    <p className="mt-0.5 text-2xl font-semibold tracking-[-0.02em]">{g.value.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-1.5 gap-[2px]" role="img" aria-label={gender.map((g) => `${g.label} ${g.value.toFixed(1)}%`).join(", ")}>
                {gender.map((g, i) => (
                  <div key={g.label} className={`h-full rounded-full transition-all duration-500 ${GENDER_TONES[i] || GENDER_TONES[2]}`} style={{ flex: `${g.value} 1 0%` }} />
                ))}
              </div>
            </div>
          )}

          {available.length > 0 && (
            <>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                <p className={EYEBROW}>{current === "ages" ? "Edad" : "Ubicaciones principales"}</p>
                {available.length > 1 && (
                  <Segmented small label="Tipo de dato de público" value={current} onChange={setView} options={available.map((k) => ({ value: k, label: LOCATION_LABELS[k] }))} />
                )}
              </div>
              <ul key={`${acc.id}-${current}`} className="ig-fade mt-2">
                {rows.map((r) => (
                  <li key={r.label} className="flex items-center gap-3 py-2.5">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold tracking-wide ${FILL} ${INK2}`}>
                      {r.code || <Icon name={current === "ages" ? "users" : "pin"} className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate text-sm font-medium">{r.label}</p>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">{r.value.toFixed(1)}%</p>
                      </div>
                      <ProgressBar value={r.value} className="mt-1.5" />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta 5 · Actividad (gráfica spline)                             */
/* ------------------------------------------------------------------ */

function SplineChart({ values, axisLabels, tipLabels, unit, ariaLabel }) {
  const wrapRef = useRef(null);
  const { width, height } = useElementSize(wrapRef);
  const [hover, setHover] = useState(null);
  const gid = `ig-grad-${useId().replace(/:/g, "")}`;

  const n = values.length;
  const pad = { l: 40, r: 10, t: 14, b: 28 };
  const innerW = Math.max(0, width - pad.l - pad.r);
  const innerH = Math.max(0, height - pad.t - pad.b);
  const { max, ticks } = useMemo(() => niceScale(Math.max(...values)), [values]);
  const x = (i) => pad.l + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v) => pad.t + innerH - (v / max) * innerH;
  const base = pad.t + innerH;

  const pts = values.map((v, i) => [x(i), y(v)]);
  const line = monotonePath(pts);
  const area = n ? `${line} L${pts[n - 1][0]},${base} L${pts[0][0]},${base} Z` : "";

  const indexFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - pad.l) / Math.max(1, innerW)) * (n - 1));
    return clamp(i, 0, n - 1);
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const step = e.key === "ArrowRight" ? 1 : -1;
      setHover((h) => clamp(h == null ? (step > 0 ? 0 : n - 1) : h + step, 0, n - 1));
    } else if (e.key === "Escape") {
      setHover(null);
    }
  };

  const mark = hover ?? n - 1;
  const tipTop = hover != null ? (y(values[hover]) > 72 ? y(values[hover]) - 62 : y(values[hover]) + 14) : 0;
  const tipLeft = clamp(hover != null ? x(hover) : 0, 64, Math.max(64, width - 64));

  return (
    <div ref={wrapRef} className="relative mt-5 min-h-[240px] flex-1 select-none">
      {width > 0 && height > 0 && (
        <svg
          width={width}
          height={height}
          className={`absolute inset-0 block cursor-crosshair rounded-xl ${FOCUS}`}
          role="img"
          aria-label={ariaLabel}
          tabIndex={0}
          style={{ touchAction: "pan-y" }}
          onPointerMove={(e) => setHover(indexFromEvent(e))}
          onPointerDown={(e) => setHover(indexFromEvent(e))}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--ink)", stopOpacity: 0.14 }} />
              <stop offset="100%" style={{ stopColor: "var(--ink)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} strokeWidth="1" style={{ stroke: t === 0 ? "var(--axis)" : "var(--grid)" }} />
              <text x={pad.l - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" style={{ fill: "var(--faint)", fontVariantNumeric: "tabular-nums" }}>
                {formatAxis(t)}
              </text>
            </g>
          ))}

          {axisLabels.map((l, i) =>
            l ? (
              <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="11" style={{ fill: hover === i ? "var(--ink)" : "var(--faint)" }}>
                {l}
              </text>
            ) : null
          )}

          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ink)" }} />

          {hover != null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={base} strokeWidth="1" style={{ stroke: "var(--dash)" }} />}
          <circle cx={x(mark)} cy={y(values[mark])} r="5" strokeWidth="2" style={{ fill: "var(--ink)", stroke: "var(--card)" }} />
        </svg>
      )}

      {hover != null && width > 0 && (
        <div className="ig-shadow-tip pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-[color:var(--tip)] px-3 py-2 text-[color:var(--tip-ink)]" style={{ left: tipLeft, top: tipTop }}>
          <p className="text-[15px] font-semibold leading-tight tabular-nums">{nf.format(values[hover])}</p>
          <p className="text-[11px] text-[color:var(--tip-sub)]">
            {unit} · {tipLabels[hover]}
          </p>
        </div>
      )}

      {/* Una tabla no se encoge a 1px, así que el contenedor oculto es un div */}
      <div className="sr-only">
        <table>
          <caption>{ariaLabel}</caption>
          <tbody>
            {values.map((v, i) => (
              <tr key={i}>
                <th scope="row">{tipLabels[i]}</th>
                <td>{nf.format(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="min-w-0">
      <p className={`text-[13px] ${MUTED}`}>{label}</p>
      <p className="mt-0.5 text-lg font-semibold tracking-[-0.01em] tabular-nums">{value}</p>
      {sub && <p className={`text-xs ${FAINT}`}>{sub}</p>}
    </div>
  );
}

function ActivityCard({ acc, prefs, className = "" }) {
  const [mode, setMode] = useState(acc.charts[0].id);
  const chart = acc.charts.find((c) => c.id === mode) || acc.charts[0];
  const ready = chart.values.length > 1;

  return (
    <Card className={className}>
      <CardHeader
        title="Actividad"
        subtitle={chart.subtitle}
        right={<Segmented small label="Periodo de la gráfica" value={chart.id} onChange={setMode} options={acc.charts.map((c) => ({ value: c.id, label: c.label }))} />}
      />

      <div key={`${acc.id}-${chart.id}`} className="ig-fade flex flex-1 flex-col">
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="text-[2.5rem] font-bold leading-none tracking-[-0.04em]">{formatNumber(chart.total, prefs.compact)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`text-[13px] ${MUTED}`}>{chart.totalLabel}</span>
              {prefs.compare && <DeltaPill value={chart.delta} suffix={chart.deltaSuffix} />}
            </div>
          </div>
          <div className="flex gap-8">
            {chart.stats.map((s) => (
              <Stat key={s.label} label={s.label} value={formatNumber(s.value, prefs.compact)} sub={s.sub} />
            ))}
          </div>
        </div>

        {ready ? (
          <SplineChart values={chart.values} axisLabels={chart.axisLabels} tipLabels={chart.tipLabels} unit={chart.unit} ariaLabel={chart.ariaLabel} />
        ) : (
          <div className="mt-5 flex min-h-[240px] flex-1 flex-col">
            <EmptyState icon="activity" title="Sin serie diaria todavía">Instagram tarda hasta 48 horas en procesar el alcance de cada día.</EmptyState>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta 6 · Recomendaciones                                        */
/* ------------------------------------------------------------------ */

function SourceLinks({ keys }) {
  return (
    <p className={`min-w-0 text-[11px] leading-snug ${FAINT}`}>
      {keys.map((k, i) => (
        <React.Fragment key={k}>
          {i > 0 && " · "}
          <a href={SOURCES[k].url} target="_blank" rel="noopener noreferrer" className={`rounded underline-offset-2 hover:text-[color:var(--ink)] hover:underline ${FOCUS}`}>
            {SOURCES[k].label}
          </a>
        </React.Fragment>
      ))}
    </p>
  );
}

function TriedButton({ done, onToggle, title }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      aria-label={done ? `Marcar como pendiente: ${title}` : `Marcar como probado: ${title}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-xs font-medium transition ${FOCUS} ${
        done ? ACCENT : `${CARD_BG} ${INK2} hover:text-[color:var(--ink)] ig-shadow`
      }`}
    >
      <span className={`grid h-5 w-5 place-items-center rounded-full ${done ? "" : `border ${DASH}`}`}>{done && <Icon name="check" className="h-3 w-3" strokeWidth={2.5} />}</span>
      {done ? "Probado" : "Lo probé"}
    </button>
  );
}

function TipTile({ tip, done, onToggle }) {
  return (
    <li className={`flex flex-col rounded-[22px] p-4 sm:p-5 ${FILL2}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${CARD_BG} ${INK} ig-shadow`}>
          <Icon name={tip.icon} className="h-[17px] w-[17px]" />
        </span>
        <span className={`truncate rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${DASH} ${MUTED}`}>{tip.tag}</span>
      </div>
      <h3 className="mt-3.5 text-balance text-[15px] font-semibold leading-snug">{tip.title}</h3>
      <p className={`mt-1.5 text-[13px] leading-relaxed ${INK2}`}>{tip.body}</p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <SourceLinks keys={tip.src} />
        <TriedButton done={done} onToggle={onToggle} title={tip.title} />
      </div>
    </li>
  );
}

function InsightTile({ icon, label, stat, text, action }) {
  return (
    <li className={`flex flex-col rounded-[22px] p-4 sm:p-5 ${FILL2}`}>
      <div className="flex items-center gap-2">
        <Icon name={icon} className={`h-4 w-4 ${MUTED}`} />
        <p className={`text-[13px] font-medium ${MUTED}`}>{label}</p>
      </div>
      <p className="mt-3 text-[2rem] font-bold leading-none tracking-[-0.03em]">{stat}</p>
      <p className={`mt-2.5 text-[13px] leading-relaxed ${INK2}`}>{text}</p>
      <p className="mt-auto flex items-start gap-2 border-t border-[color:var(--sep)] pt-3 text-[13px] font-medium leading-snug">
        <Icon name="arrowUp" className="mt-0.5 h-3.5 w-3.5 shrink-0 rotate-45" strokeWidth={2.25} />
        {action}
      </p>
    </li>
  );
}

function HookCard({ hook }) {
  const [state, setState] = useState("idle");
  const textRef = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (s, ms) => {
    setState(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), ms);
  };
  const selectText = () => {
    try {
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch {
      /* sin selección disponible */
    }
    flash("select", 2600);
  };
  const copy = () => {
    try {
      navigator.clipboard.writeText(hook.template).then(() => flash("copied", 1600), selectText);
    } catch {
      selectText();
    }
  };

  return (
    <li className={`flex flex-col rounded-[22px] p-4 ${FILL2}`}>
      <div className="flex items-center justify-between gap-2">
        <p className={EYEBROW}>{hook.type}</p>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copiar plantilla: ${hook.template}`}
          className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition ${FOCUS} ${state === "copied" ? ACCENT : `${CARD_BG} ${INK2} hover:text-[color:var(--ink)] ig-shadow`}`}
        >
          <Icon name={state === "copied" ? "check" : "copy"} className="h-3.5 w-3.5" />
          {state === "copied" ? "Copiado" : state === "select" ? "Cópialo tú" : "Copiar"}
        </button>
      </div>
      <p ref={textRef} className="mt-3 text-[15px] font-semibold leading-snug">
        {hook.template}
      </p>
      <p className={`mt-2 text-[13px] leading-snug ${MUTED}`}>Ej. «{hook.example}»</p>
    </li>
  );
}

function RecommendationsCard({ acc, goal, tried, onToggleTried, className = "" }) {
  const [tab, setTab] = useState("foryou");
  const insights = acc.buildInsights(goal);
  const allTips = [...TIPS.trends, ...TIPS.virality, ...TIPS.engagement];
  const triedCount = allTips.filter((t) => tried[t.id]).length;
  const tips = TIPS[tab] || [];
  const totalWeight = sum(REEL_STRUCTURE.map((s) => s.weight));
  const gridCols = insights.length >= 4 ? "lg:grid-cols-4" : insights.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <Card className={className}>
      <CardHeader
        title="Recomendaciones"
        subtitle={`Tendencias y buenas prácticas de Instagram · investigado el ${RESEARCH_DATE}`}
        right={<IconBadge icon="bulb" />}
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-1 max-w-full overflow-x-auto px-1 pb-1">
          <Segmented
            small
            label="Tipo de recomendación"
            value={tab}
            onChange={setTab}
            options={[
              { value: "foryou", label: "Para tu cuenta" },
              { value: "trends", label: "Tendencias" },
              { value: "virality", label: "Viralidad" },
              { value: "hooks", label: "Hooks" },
              { value: "engagement", label: "Engagement" },
            ]}
          />
        </div>
        <p className={`text-xs tabular-nums ${MUTED}`}>
          <span className={`font-semibold ${INK}`}>{triedCount}</span> de {allTips.length} consejos probados
        </p>
      </div>

      <div key={`${tab}-${acc.id}`} className="ig-fade mt-4">
        {tab === "foryou" &&
          (insights.length ? (
            <>
              <ul className={`grid gap-3 sm:grid-cols-2 ${gridCols}`}>
                {insights.map((ins) => (
                  <InsightTile key={ins.id} {...ins} />
                ))}
              </ul>
              <p className={`mt-3 text-xs ${FAINT}`}>
                {acc.source === "live" ? `Calculado en vivo con tus datos de Instagram (${acc.handle}).` : `Calculado con los datos de ejemplo de ${acc.name}.`}
              </p>
            </>
          ) : (
            <EmptyState icon="bulb" title="Aún no hay suficientes datos">Las recomendaciones aparecen cuando Instagram entrega tu actividad y tu público.</EmptyState>
          ))}

        {tab === "hooks" && (
          <>
            <div className={`rounded-[22px] p-4 sm:p-5 ${FILL2}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[15px] font-semibold">Estructura de un reel que retiene</h3>
                <p className={`text-xs ${MUTED}`}>~60% ve los reels sin sonido: pon el hook también como texto en pantalla.</p>
              </div>
              <div className="mt-4 flex h-1.5 gap-[2px]" aria-hidden="true">
                {REEL_STRUCTURE.map((s, i) => (
                  <div key={s.title} className="h-full rounded-full" style={{ flex: `${s.weight} 1 0%`, background: i === 0 ? "var(--accent)" : "var(--bar-2)" }} />
                ))}
              </div>
              <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {REEL_STRUCTURE.map((s, i) => (
                  <li key={s.title} className="min-w-0">
                    <p className={`text-xs font-semibold tabular-nums ${i === 0 ? INK : MUTED}`}>
                      {s.range} · {Math.round((s.weight / totalWeight) * 100)}% del video
                    </p>
                    <p className="mt-1 text-sm font-semibold">{s.title}</p>
                    <p className={`mt-0.5 text-[13px] leading-snug ${INK2}`}>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HOOKS.map((h) => (
                <HookCard key={h.id} hook={h} />
              ))}
            </ul>
            <div className="mt-3">
              <SourceLinks keys={["opus", "truefuture"]} />
            </div>
          </>
        )}

        {tips.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map((t) => (
              <TipTile key={t.id} tip={t} done={!!tried[t.id]} onToggle={() => onToggleTried(t.id)} />
            ))}
          </ul>
        )}
      </div>

      <p className={`mt-5 border-t border-[color:var(--sep)] pt-4 text-xs leading-relaxed ${FAINT}`}>
        Instagram no publica el peso exacto de cada señal. Las cifras de terceros (porcentajes, multiplicadores) son estimaciones de esas fuentes; úsalas como guía y compáralas con tus propios resultados.
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.ig-root {
  --bg: #F2F2F7; --card: #FFFFFF; --ink: #1C1C1E; --ink-2: #636366; --muted: #8E8E93; --faint: #AEAEB2;
  --fill: #F2F2F7; --fill-2: #F7F7F9; --track: #E9E9EE; --seg: #FFFFFF; --sep: #F0F0F3; --line: #EDEDF1;
  --grid: #F2F2F5; --axis: #E5E5EA; --dash: #C7C7CC; --dash-hover: #8E8E93; --hover: #FAFAFC;
  --accent: #1C1C1E; --on-accent: #FFFFFF; --bar-2: #C7C7CC; --knob-off: #FFFFFF; --ring: rgba(28,28,30,.25);
  --hero: #1C1C1E; --hero-ink: #FFFFFF; --hero-sub: rgba(255,255,255,.55); --hero-faint: rgba(255,255,255,.42);
  --hero-box: #2C2C2E; --hero-chip: rgba(255,255,255,.10);
  --tip: #1C1C1E; --tip-ink: #FFFFFF; --tip-sub: rgba(255,255,255,.6);
  --shadow: 0 1px 2px rgba(0,0,0,.03), 0 16px 40px -18px rgba(0,0,0,.10);
  --shadow-hero: 0 2px 4px rgba(0,0,0,.06), 0 24px 48px -20px rgba(0,0,0,.45);
  --shadow-pop: 0 0 0 1px rgba(0,0,0,.04), 0 24px 48px -12px rgba(0,0,0,.20);
  --shadow-seg: 0 1px 3px rgba(0,0,0,.10);
  --shadow-tip: 0 12px 24px -8px rgba(0,0,0,.35);
  color-scheme: light;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: var(--bg);
  color: var(--ink);
  transition: background-color .3s ease, color .3s ease;
}
.ig-root[data-theme="dark"] {
  --bg: #000000; --card: #1C1C1E; --ink: #F5F5F7; --ink-2: #AEAEB2; --muted: #8E8E93; --faint: #6E6E73;
  --fill: #2C2C2E; --fill-2: #242426; --track: #2C2C2E; --seg: #48484A; --sep: #2C2C2E; --line: #2C2C2E;
  --grid: #242426; --axis: #38383A; --dash: #48484A; --dash-hover: #8E8E93; --hover: #242426;
  --accent: #F5F5F7; --on-accent: #1C1C1E; --bar-2: #48484A; --knob-off: #AEAEB2; --ring: rgba(245,245,247,.4);
  --hero: #F5F5F7; --hero-ink: #1C1C1E; --hero-sub: rgba(0,0,0,.55); --hero-faint: rgba(0,0,0,.45);
  --hero-box: #E5E5EA; --hero-chip: rgba(0,0,0,.07);
  --tip: #F5F5F7; --tip-ink: #1C1C1E; --tip-sub: rgba(0,0,0,.55);
  --shadow: 0 0 0 1px rgba(255,255,255,.05);
  --shadow-hero: 0 24px 48px -20px rgba(0,0,0,.8);
  --shadow-pop: 0 0 0 1px rgba(255,255,255,.08), 0 24px 48px -12px rgba(0,0,0,.7);
  --shadow-seg: 0 1px 3px rgba(0,0,0,.4);
  --shadow-tip: 0 12px 24px -8px rgba(0,0,0,.7);
  color-scheme: dark;
}
.ig-shadow { box-shadow: var(--shadow); }
.ig-shadow-hero { box-shadow: var(--shadow-hero); }
.ig-shadow-pop { box-shadow: var(--shadow-pop); }
.ig-shadow-seg { box-shadow: var(--shadow-seg); }
.ig-shadow-tip { box-shadow: var(--shadow-tip); }
@keyframes igFade { from { opacity: .35; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@keyframes igPop { from { opacity: 0; transform: translateY(-4px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes igPulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes igSpin { to { transform: rotate(360deg); } }
.ig-fade { animation: igFade .4s cubic-bezier(.2,.7,.2,1) both; }
.ig-pop { animation: igPop .18s ease-out both; transform-origin: top right; }
.ig-pulse { animation: igPulse 2s ease-in-out infinite; }
.ig-spin { animation: igSpin 1s linear infinite; }
@media (prefers-reduced-motion: reduce) { .ig-fade, .ig-pop, .ig-pulse, .ig-spin { animation: none; } .ig-root, .ig-root * { transition: none !important; } }
`;

const SAMPLE_MODELS = SAMPLE_ACCOUNTS.map(sampleModel);

export default function InstagramDashboard() {
  const [stored] = useState(loadStore);
  const [accountId, setAccountId] = useState(() => stored.accountId || SAMPLE_MODELS[0].id);
  const [prefs, setPrefs] = useState(() => ({ compact: true, compare: true, ...(stored.prefs || {}) }));
  const [notes, setNotes] = useState(() => (stored.notes && typeof stored.notes === "object" ? stored.notes : {}));
  const [milestones, setMilestones] = useState(() => (stored.milestones && typeof stored.milestones === "object" ? stored.milestones : {}));
  const [tried, setTried] = useState(() => (stored.tried && typeof stored.tried === "object" ? stored.tried : {}));
  const [themeChoice, setThemeChoice] = useState(() => (stored.theme === "light" || stored.theme === "dark" ? stored.theme : null));
  const [editing, setEditing] = useState(false);
  const theme = themeChoice || systemTheme();

  // --- Datos en vivo ---
  const mcp = useMcpCapability();
  const [ig, refreshInstagram] = useInstagramLive(mcp.api);
  const [tkEnabled, setTkEnabled] = useState(false);
  const tiktok = useTikTok(mcp.api, tkEnabled);

  // TikTok se carga solo si el visitante ya dio permiso a Metricool; si no, espera a que lo pida
  useEffect(() => {
    if (!mcp.api) return undefined;
    let alive = true;
    window.claude
      .use("permissions")
      .then((perm) => (perm ? perm.state(`mcp:${MC_SERVER}`) : "unavailable"))
      .then((s) => {
        if (alive && s === "granted") setTkEnabled(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [mcp.api]);

  // Una tarjeta por cuenta conectada en Composio; las de ejemplo solo cubren cuentas que falten
  const liveModels = useMemo(() => (ig.accounts ? ig.accounts.map((a) => instagramModel({ ...a, storedAt: ig.storedAt })) : []), [ig]);
  const hasLive = liveModels.length > 0;
  const accounts = useMemo(() => {
    if (!hasLive) return SAMPLE_MODELS;
    const liveHandles = new Set(liveModels.map((m) => m.handle.toLowerCase()));
    const extras = SAMPLE_MODELS.filter((s) => s.id !== "principal" && !liveHandles.has(s.handle.toLowerCase()));
    return [...liveModels, ...extras];
  }, [liveModels, hasLive]);

  const acc = accounts.find((a) => a.id === accountId) || accounts[0];
  const connecting = mcp.status === "connecting" || (mcp.status === "ready" && ig.status === "loading");
  const igError = ig.status === "error" ? ig.error : null;
  const refreshing = !!ig.refreshing;

  const refresh = () => {
    if (!mcp.api || refreshing) return;
    refreshInstagram();
    if (tkEnabled) Promise.resolve(mcp.api.invalidate(MC_SERVER)).catch(() => {});
  };

  useEffect(() => {
    saveStore({ accountId: acc.id, prefs, notes, milestones, tried, theme: themeChoice });
  }, [acc.id, prefs, notes, milestones, tried, themeChoice]);

  // Pinta también el fondo de la página para que no asome el color del otro tema
  useEffect(() => {
    const bg = theme === "dark" ? "#000000" : "#F2F2F7";
    document.body.style.background = bg;
    document.documentElement.style.background = bg;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const milestone = { ...acc.milestone, ...(milestones[acc.id] || {}) };
  const accNotes = Array.isArray(notes[acc.id]) ? notes[acc.id] : acc.seedNotes;

  const addNote = (text) =>
    setNotes((prev) => ({
      ...prev,
      [acc.id]: [...(Array.isArray(prev[acc.id]) ? prev[acc.id] : acc.seedNotes), { id: `${acc.id}-${Date.now()}`, text, date: shortDate() }],
    }));
  const deleteNote = (id) => setNotes((prev) => ({ ...prev, [acc.id]: (Array.isArray(prev[acc.id]) ? prev[acc.id] : acc.seedNotes).filter((n) => n.id !== id) }));
  const changeMilestone = (patch) => setMilestones((prev) => ({ ...prev, [acc.id]: { ...(prev[acc.id] || {}), ...patch } }));
  const resetMilestone = () =>
    setMilestones((prev) => {
      const next = { ...prev };
      delete next[acc.id];
      return next;
    });
  const toggleTried = (id) => setTried((prev) => ({ ...prev, [id]: !prev[id] }));

  const chipKind = acc.source === "live" ? "live" : connecting ? "connecting" : "sample";

  return (
    <div className={`ig-root min-h-screen ${INK}`} data-theme={theme}>
      <style>{GLOBAL_CSS}</style>

      <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <TopBar
          accounts={accounts}
          accountId={acc.id}
          onSelect={setAccountId}
          editing={editing}
          onToggleEdit={() => setEditing((e) => !e)}
          prefs={prefs}
          setPrefs={setPrefs}
          theme={theme}
          onToggleTheme={() => setThemeChoice(theme === "dark" ? "light" : "dark")}
          compareLabel={acc.compareSuffix}
          showSampleTags={hasLive}
        />

        <header className="mb-6 mt-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[2.75rem] font-bold leading-none tracking-[-0.04em] sm:text-6xl">Analíticas</h1>
            <p className={`mt-2.5 text-sm ${MUTED}`}>{todayLabel()}</p>
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <p className="text-sm font-medium">
              {acc.handle} <span className={`font-normal ${MUTED}`}>· Periodo: {acc.rangeLabel}</span>
            </p>
            <SourceChip kind={chipKind} />
          </div>
        </header>

        {igError && (
          <Banner
            action={
              canRetry(igError) ? (
                <button type="button" onClick={refreshInstagram} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${ACCENT} ${FOCUS}`}>
                  Reintentar
                </button>
              ) : null
            }
          >
            {errorCopy(igError)} Mientras tanto ves datos de ejemplo.
          </Banner>
        )}

        {hasLive && acc.source === "sample" && (
          <Banner icon="flag">
            <strong className={INK}>{acc.name}</strong> todavía no está conectado, así que estos números son de ejemplo. Conecta su Instagram en Composio y aparecerá aquí con datos reales.
          </Banner>
        )}

        {acc.source === "live" && <LiveStrip acc={acc} tiktok={tiktok} onConnectTikTok={() => setTkEnabled(true)} onRefresh={refresh} refreshing={refreshing} />}

        {editing && (
          <Banner
            icon="pencil"
            action={
              <button type="button" onClick={() => setEditing(false)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${ACCENT} ${FOCUS}`}>
                Terminar
              </button>
            }
          >
            Modo edición: cambia el titular, el resumen y la meta de seguidores, o elimina notas de campaña.
          </Banner>
        )}

        <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <HeroCard acc={acc} prefs={prefs} />
          <MilestonesCard
            acc={acc}
            editing={editing}
            milestone={milestone}
            onMilestoneChange={changeMilestone}
            onMilestoneReset={resetMilestone}
            notes={accNotes}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
          />
          <ContentCard key={`content-${acc.id}`} acc={acc} prefs={prefs} />
          <AudienceCard key={`audience-${acc.id}`} acc={acc} />
          <ActivityCard key={`activity-${acc.id}`} acc={acc} prefs={prefs} className="md:col-span-2" />
          <RecommendationsCard acc={acc} goal={milestone.goal} tried={tried} onToggleTried={toggleTried} className="md:col-span-2 lg:col-span-3" />
        </main>

        <p className={`mt-8 text-center text-xs ${FAINT}`}>
          {acc.source === "live"
            ? "Datos en vivo de Instagram (vía Composio) leídos con tus credenciales. Nada de esto se guarda en la página."
            : "Datos de ejemplo. Abre esta página en claude.ai con Composio conectado para ver tus métricas reales."}
        </p>
      </div>
    </div>
  );
}
