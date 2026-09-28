import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Datos de ejemplo (mock). Sustituye ACCOUNTS por la respuesta de    */
/*  tu API/base de datos respetando la misma forma.                    */
/* ------------------------------------------------------------------ */

const PERIOD = { label: "Agosto 2026", month: "agosto", prevMonth: "julio", short: "ago", year: 2026, monthIndex: 7, days: 31 };
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago"];
const MONTHS_LONG = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto"];
const WEEKDAYS = ["domingos", "lunes", "martes", "miércoles", "jueves", "viernes", "sábados"];

const ACCOUNTS = [
  {
    id: "principal",
    name: "Principal",
    handle: "@cuenta.principal",
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
      { id: "p1", title: "Detrás de cámaras: rodaje en CDMX", type: "reel", day: 26, views: 412800, likes: 28400, tone: "linear-gradient(135deg,#3A3A3C,#1C1C1E)" },
      { id: "p2", title: "5 errores al editar tus reels", type: "carrusel", day: 21, views: 186200, likes: 14100, tone: "linear-gradient(135deg,#AEAEB2,#636366)" },
      { id: "p3", title: "Atardecer en Valle de Bravo", type: "foto", day: 17, views: 94600, likes: 9800, tone: "linear-gradient(135deg,#C7C7CC,#8E8E93)" },
      { id: "p4", title: "Mi setup de edición 2026", type: "reel", day: 12, views: 268900, likes: 19300, tone: "linear-gradient(135deg,#8E8E93,#3A3A3C)" },
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
    handle: "@kyros.oficial",
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
      { id: "k1", title: "Lanzamiento: colección Otoño", type: "reel", day: 28, views: 142300, likes: 9600, tone: "linear-gradient(135deg,#3A3A3C,#1C1C1E)" },
      { id: "k2", title: "Cómo elegimos nuestros materiales", type: "carrusel", day: 23, views: 58700, likes: 4200, tone: "linear-gradient(135deg,#C7C7CC,#8E8E93)" },
      { id: "k3", title: "Lookbook nocturno", type: "foto", day: 18, views: 31400, likes: 3100, tone: "linear-gradient(135deg,#8E8E93,#3A3A3C)" },
      { id: "k4", title: "Un día en el estudio", type: "reel", day: 11, views: 96800, likes: 6900, tone: "linear-gradient(135deg,#AEAEB2,#636366)" },
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

const TYPE_LABEL = { reel: "Reel", carrusel: "Carrusel", foto: "Foto" };
const TYPE_ICON = { reel: "play", carrusel: "copy", foto: "image" };

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

function formatNumber(n, compact = true) {
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

const pctChange = (cur, prev) => ((cur - prev) / prev) * 100;
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const avg = (arr) => (arr.length ? sum(arr) / arr.length : 0);
const argmax = (arr) => arr.reduce((best, v, i) => (v > arr[best] ? i : best), 0);
const argmin = (arr) => arr.reduce((best, v, i) => (v < arr[best] ? i : best), 0);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function dayLabel(day) {
  const d = new Date(PERIOD.year, PERIOD.monthIndex, day);
  const wd = d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "");
  return `${wd} ${day} ${PERIOD.short}`;
}

function todayLabel() {
  return capitalize(new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
}

function shortDate(d = new Date()) {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
}

// Promedio de interacciones por día de la semana (0 = domingo)
function weekdayAverages(daily) {
  const sums = Array(7).fill(0);
  const counts = Array(7).fill(0);
  daily.forEach((v, i) => {
    const wd = new Date(PERIOD.year, PERIOD.monthIndex, i + 1).getDay();
    sums[wd] += v;
    counts[wd] += 1;
  });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
}

// Escala "bonita": el menor paso (1, 2, 2.5, 5 × 10^n) que cubre el máximo en ≤ 5 divisiones
function niceScale(maxVal) {
  const steps = [];
  for (let e = 0; e <= 8; e++) for (const m of [1, 2, 2.5, 5]) steps.push(m * 10 ** e);
  const step = steps.find((s) => Math.ceil(maxVal / s) <= 5) || steps[steps.length - 1];
  const count = Math.max(1, Math.ceil(maxVal / step));
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
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useAnimatedNumber(target, duration = 650) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    if (reduce || from === target) {
      fromRef.current = target;
      setValue(target);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (target - from) * (1 - Math.pow(1 - p, 3));
      fromRef.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
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
  search: (<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
  flask: (<><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></>),
  calendar: (<><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>),
  sparkles: <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />,
  music: (<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
  camera: (<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>),
  message: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  megaphone: (<><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>),
  bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />,
  external: (<><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>),
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
  const up = value >= 0;
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
          onHero ? "bg-[color:var(--hero-chip)] text-[color:var(--hero-ink)]" : `${FILL} ${INK}`
        }`}
      >
        <Icon name={up ? "arrowUp" : "arrowDown"} className="h-3 w-3" strokeWidth={2.25} />
        {up ? "+" : "−"}
        {Math.abs(value).toFixed(1)}%
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
/*  Barra superior                                                     */
/* ------------------------------------------------------------------ */

function SettingsMenu({ prefs, setPrefs }) {
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
              <span className="block text-sm font-medium">Comparar con {PERIOD.prevMonth}</span>
              <span className={`block text-xs ${MUTED}`}>Muestra el cambio vs el mes anterior</span>
            </label>
            <Switch id="pref-compare" checked={prefs.compare} onChange={(v) => setPrefs((p) => ({ ...p, compare: v }))} />
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar({ accountId, onSelect, editing, onToggleEdit, prefs, setPrefs, theme, onToggleTheme }) {
  const dark = theme === "dark";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Segmented
        label="Cuenta de Instagram"
        value={accountId}
        onChange={onSelect}
        options={ACCOUNTS.map((a) => ({
          value: a.id,
          render: (active) => (
            <>
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold transition-colors ${active ? ACCENT : `${CARD_BG} ${INK2}`}`}>{a.initial}</span>
              {a.name}
            </>
          ),
        }))}
      />
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
        <SettingsMenu prefs={prefs} setPrefs={setPrefs} />
      </div>
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
      {delta != null ? (
        <p className="mt-0.5 flex items-center gap-0.5 text-xs tabular-nums text-[color:var(--hero-sub)]">
          <Icon name={delta >= 0 ? "arrowUp" : "arrowDown"} className="h-3 w-3" strokeWidth={2.25} />
          {delta >= 0 ? "+" : "−"}
          {Math.abs(delta).toFixed(1)}%
        </p>
      ) : (
        <p className="mt-0.5 truncate text-xs text-[color:var(--hero-faint)]">{note}</p>
      )}
    </div>
  );
}

function HeroCard({ acc, prefs }) {
  const net = acc.followersEnd - acc.followersStart;
  const views = useAnimatedNumber(acc.views);
  const netAnim = useAnimatedNumber(net);
  const growth = (net / acc.followersStart) * 100;
  const rate = (acc.interactions / acc.views) * 100;
  const viewsText = formatNumber(views, prefs.compact);

  return (
    <Card hero>
      <CardHeader
        hero
        title="Resumen"
        subtitle={`${PERIOD.label} · ${acc.handle}`}
        right={<span className="rounded-full bg-[color:var(--hero-chip)] px-2.5 py-1 text-xs font-medium text-[color:var(--hero-sub)]">Mensual</span>}
      />

      <div className="mt-8">
        <p className="text-[13px] font-medium text-[color:var(--hero-sub)]">Visualizaciones totales</p>
        <p className={`mt-1.5 font-bold leading-none tracking-[-0.04em] ${viewsText.length > 7 ? "text-[2.6rem]" : "text-[3.5rem]"}`}>{viewsText}</p>
        {prefs.compare && <DeltaPill onHero className="mt-3" value={pctChange(acc.views, acc.viewsPrev)} suffix={`vs ${PERIOD.prevMonth}`} />}
      </div>

      <div className="mt-7">
        <p className="text-[13px] font-medium text-[color:var(--hero-sub)]">Seguidores netos del mes</p>
        <p className="mt-1.5 text-[2.6rem] font-bold leading-none tracking-[-0.04em]">+{nf.format(Math.round(netAnim))}</p>
        <p className="mt-2.5 text-[13px] text-[color:var(--hero-faint)]">{nf.format(acc.followersEnd)} seguidores en total</p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2.5 pt-8">
        <MiniStat icon="heart" label="Interacciones" value={formatNumber(acc.interactions, prefs.compact)} delta={prefs.compare ? pctChange(acc.interactions, acc.interactionsPrev) : null} note="likes, comentarios y más" />
        <MiniStat icon="trending" label="Crecimiento" value={`+${growth.toFixed(1)}%`} note="de seguidores" />
        <MiniStat icon="radio" label="Alcance" value={formatNumber(acc.reach, prefs.compact)} delta={prefs.compare ? pctChange(acc.reach, acc.reachPrev) : null} note="cuentas únicas" />
        <MiniStat icon="activity" label="Engagement" value={`${rate.toFixed(1)}%`} note="interacciones / vistas" />
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

  const peak = argmax(acc.daily);
  const goal = Math.max(1, Number(milestone.goal) || acc.milestone.goal);
  const progress = (acc.followersEnd / goal) * 100;
  const remaining = Math.max(0, goal - acc.followersEnd);

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
      <CardHeader title="Hitos del Mes" subtitle={PERIOD.label} right={<IconBadge icon="flag" />} />

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
              <input id={`ms-goal-${acc.id}`} type="number" min="1" step="100" inputMode="numeric" className={`${INPUT} tabular-nums`} value={milestone.goal} onChange={(e) => onMilestoneChange({ goal: e.target.value })} />
            </label>
            <button type="button" onClick={onMilestoneReset} className={`rounded-full px-1 text-xs font-medium underline-offset-2 hover:underline ${MUTED} hover:text-[color:var(--ink)] ${FOCUS}`}>
              Restablecer texto original
            </button>
          </div>
        ) : (
          <>
            <h3 className="mt-5 text-balance text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]">{milestone.title}</h3>
            <p className={`mt-2 text-[15px] leading-relaxed ${INK2}`}>{milestone.body}</p>
          </>
        )}

        <ul className="mt-4 divide-y divide-[color:var(--sep)]">
          <ListRow icon="zap" title="Día récord" subtitle={`${dayLabel(peak + 1)} · interacciones`} right={nf.format(acc.daily[peak])} />
          <ListRow icon="target" title="Meta de seguidores" subtitle={remaining > 0 ? `Faltan ${nf.format(remaining)} para ${nf.format(goal)}` : `Meta de ${nf.format(goal)} cumplida`} right={`${Math.min(100, progress).toFixed(0)}%`}>
            <ProgressBar value={progress} className="mt-2" />
          </ListRow>
        </ul>
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
  const posts = useMemo(() => [...acc.posts].sort((a, b) => (sort === "recent" ? b.day - a.day : b.views - a.views)), [acc, sort]);
  const share = (sum(acc.posts.map((p) => p.views)) / acc.views) * 100;

  return (
    <Card>
      <CardHeader
        title="Rendimiento de contenido"
        subtitle="Publicaciones recientes"
        right={
          <Segmented
            small
            label="Ordenar publicaciones"
            value={sort}
            onChange={setSort}
            options={[
              { value: "recent", label: "Recientes" },
              { value: "top", label: "Más vistas" },
            ]}
          />
        }
      />

      <ul key={`${acc.id}-${sort}`} className="ig-fade mt-3 divide-y divide-[color:var(--sep)]">
        {posts.map((p) => (
          <li key={p.id} className="flex items-center gap-3.5 py-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px]" style={{ background: p.tone }} aria-hidden="true">
              <Icon name={TYPE_ICON[p.type]} className="h-[18px] w-[18px] text-white/90" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 break-words text-[15px] font-medium leading-snug">{p.title}</p>
              <p className={`mt-0.5 text-[13px] ${MUTED}`}>
                {TYPE_LABEL[p.type]} · {p.day} {PERIOD.short}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="flex items-center justify-end gap-1 text-[15px] font-semibold tabular-nums">
                <Icon name="eye" className={`h-3.5 w-3.5 ${FAINT}`} />
                <span className="sr-only">Visualizaciones:</span>
                {formatNumber(p.views, prefs.compact)}
              </p>
              <p className={`mt-0.5 flex items-center justify-end gap-1 text-[13px] tabular-nums ${MUTED}`}>
                <Icon name="heart" className={`h-3.5 w-3.5 ${FAINT}`} />
                <span className="sr-only">Me gusta:</span>
                {formatNumber(p.likes, prefs.compact)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-3">
        <p className={`rounded-2xl px-4 py-3 text-[13px] leading-snug ${FILL2} ${INK2}`}>
          Estas 4 publicaciones generaron el <span className={`font-semibold ${INK}`}>{share.toFixed(0)}%</span> de tus visualizaciones de {PERIOD.month}.
        </p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta 4 · Público                                                */
/* ------------------------------------------------------------------ */

function AudienceCard({ acc }) {
  const [view, setView] = useState("countries");
  const gender = [...acc.gender].sort((a, b) => b.value - a.value);
  const rows = view === "countries" ? acc.countries : acc.cities;

  return (
    <Card>
      <CardHeader title="Público" subtitle={`Seguidores al 31 ${PERIOD.short} ${PERIOD.year}`} right={<IconBadge icon="users" />} />

      <div key={acc.id} className="ig-fade mt-6">
        <p className={EYEBROW}>Género</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          {gender.map((g, i) => (
            <div key={g.label} className={i === 0 ? "" : "text-right"}>
              <p className={`flex items-center gap-1.5 text-[13px] ${MUTED} ${i === 0 ? "" : "justify-end"}`}>
                <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[color:var(--accent)]" : "bg-[color:var(--bar-2)]"}`} />
                {g.label}
              </p>
              <p className="mt-0.5 text-2xl font-semibold tracking-[-0.02em]">{g.value.toFixed(1)}%</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-1.5 gap-[2px]" role="img" aria-label={gender.map((g) => `${g.label} ${g.value}%`).join(", ")}>
          {gender.map((g, i) => (
            <div key={g.label} className={`h-full rounded-full transition-all duration-500 ${i === 0 ? "bg-[color:var(--accent)]" : "bg-[color:var(--bar-2)]"}`} style={{ flex: `${g.value} 1 0%` }} />
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className={EYEBROW}>Ubicaciones principales</p>
        <Segmented
          small
          label="Tipo de ubicación"
          value={view}
          onChange={setView}
          options={[
            { value: "countries", label: "Países" },
            { value: "cities", label: "Ciudades" },
          ]}
        />
      </div>

      <ul key={`${acc.id}-${view}`} className="ig-fade mt-2">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3 py-2.5">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold tracking-wide ${FILL} ${INK2}`}>
              {r.code || <Icon name="pin" className="h-4 w-4" />}
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

      <table className="sr-only">
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
  const [mode, setMode] = useState("daily");
  const daily = mode === "daily";
  const values = daily ? acc.daily : acc.monthly;
  const tipLabels = daily ? values.map((_, i) => dayLabel(i + 1)) : MONTHS_LONG.map((m) => `${m} ${PERIOD.year}`);
  const axisLabels = daily ? values.map((_, i) => (i % 7 === 0 ? `${i + 1} ${PERIOD.short}` : "")) : MONTHS;
  const total = sum(values);
  const peak = argmax(values);
  const delta = daily ? pctChange(acc.interactions, acc.interactionsPrev) : pctChange(values[values.length - 1], values[0]);

  return (
    <Card className={className}>
      <CardHeader
        title="Actividad"
        subtitle={daily ? `Interacciones por día · ${PERIOD.month} ${PERIOD.year}` : `Interacciones por mes · ene – ${PERIOD.short} ${PERIOD.year}`}
        right={
          <Segmented
            small
            label="Periodo de la gráfica"
            value={mode}
            onChange={setMode}
            options={[
              { value: "daily", label: "Diario" },
              { value: "monthly", label: "Mensual" },
            ]}
          />
        }
      />

      <div key={`${acc.id}-${mode}`} className="ig-fade flex flex-1 flex-col">
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="text-[2.5rem] font-bold leading-none tracking-[-0.04em]">{formatNumber(total, prefs.compact)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`text-[13px] ${MUTED}`}>{daily ? `interacciones en ${PERIOD.month}` : `interacciones en ${PERIOD.year}`}</span>
              {prefs.compare && <DeltaPill value={delta} suffix={daily ? `vs ${PERIOD.prevMonth}` : `${PERIOD.short} vs ene`} />}
            </div>
          </div>
          <div className="flex gap-8">
            <Stat label={daily ? "Promedio diario" : "Promedio mensual"} value={formatNumber(total / values.length, prefs.compact)} />
            <Stat label={daily ? "Día récord" : "Mejor mes"} value={formatNumber(values[peak], prefs.compact)} sub={tipLabels[peak]} />
          </div>
        </div>

        <SplineChart
          values={values}
          axisLabels={axisLabels}
          tipLabels={tipLabels}
          unit="interacciones"
          ariaLabel={daily ? `Interacciones diarias de ${acc.name} en ${PERIOD.month} ${PERIOD.year}` : `Interacciones mensuales de ${acc.name}, enero a ${PERIOD.month} ${PERIOD.year}`}
        />
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
      <p className={`mt-auto flex items-start gap-2 border-t border-[color:var(--sep)] pt-3 text-[13px] font-medium leading-snug`}>
        <Icon name="arrowUp" className="mt-0.5 h-3.5 w-3.5 shrink-0 rotate-45" strokeWidth={2.25} />
        {action}
      </p>
    </li>
  );
}

function buildInsights(acc, goalValue) {
  const reels = acc.posts.filter((p) => p.type === "reel");
  const others = acc.posts.filter((p) => p.type !== "reel");
  const reelAvg = avg(reels.map((p) => p.views));
  const otherAvg = avg(others.map((p) => p.views));
  const ratio = otherAvg ? reelAvg / otherAvg : 0;

  const weekday = weekdayAverages(acc.daily);
  const best = argmax(weekday);
  const worst = argmin(weekday);
  const lift = pctChange(weekday[best], weekday[worst]);

  const net = acc.followersEnd - acc.followersStart;
  const perDay = net / PERIOD.days;
  const goal = Math.max(1, Number(goalValue) || acc.milestone.goal);
  const remaining = Math.max(0, goal - acc.followersEnd);
  const days = perDay > 0 ? Math.ceil(remaining / perDay) : null;

  const country = acc.countries[0];
  const topGender = [...acc.gender].sort((a, b) => b.value - a.value)[0];

  return [
    {
      id: "format",
      icon: "play",
      label: "Formato ganador",
      stat: `${ratio.toFixed(1)}×`,
      text: `Tus reels promedian ${formatNumber(reelAvg)} vistas contra ${formatNumber(otherAvg)} de tus carruseles y fotos.`,
      action: "Sube a 3 o 4 reels por semana y convierte tu carrusel con más vistas en reel.",
    },
    {
      id: "weekday",
      icon: "calendar",
      label: "Tu mejor día",
      stat: capitalize(WEEKDAYS[best]),
      text: `Los ${WEEKDAYS[best]} promedias ${nf.format(Math.round(weekday[best]))} interacciones, ${lift.toFixed(0)}% más que los ${WEEKDAYS[worst]}.`,
      action: `Guarda tu mejor contenido para los ${WEEKDAYS[best]} y usa los ${WEEKDAYS[worst]} para probar hooks.`,
    },
    remaining > 0
      ? {
          id: "goal",
          icon: "target",
          label: "Ritmo hacia tu meta",
          stat: days != null ? `~${days} días` : "—",
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
      stat: `${country.value.toFixed(0)}%`,
      text: `de tus seguidores está en ${country.label} y el ${topGender.value.toFixed(0)}% son ${topGender.label.toLowerCase()}.`,
      action: "Aprovecha fechas locales: empieza a grabar contenido de Día de Muertos en octubre.",
    },
  ];
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
  const insights = buildInsights(acc, goal);
  const allTips = [...TIPS.trends, ...TIPS.virality, ...TIPS.engagement];
  const triedCount = allTips.filter((t) => tried[t.id]).length;
  const tips = TIPS[tab] || [];
  const totalWeight = sum(REEL_STRUCTURE.map((s) => s.weight));

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
        {tab === "foryou" && (
          <>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {insights.map((ins) => (
                <InsightTile key={ins.id} {...ins} />
              ))}
            </ul>
            <p className={`mt-3 text-xs ${FAINT}`}>Calculado con los datos de {acc.name} en {PERIOD.month}. Cambia de cuenta arriba para ver las de la otra.</p>
          </>
        )}

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
.ig-fade { animation: igFade .4s cubic-bezier(.2,.7,.2,1) both; }
.ig-pop { animation: igPop .18s ease-out both; transform-origin: top right; }
@media (prefers-reduced-motion: reduce) { .ig-fade, .ig-pop { animation: none; } .ig-root, .ig-root * { transition: none !important; } }
`;

export default function InstagramDashboard() {
  const [stored] = useState(loadStore);
  const [accountId, setAccountId] = useState(() => (ACCOUNTS.some((a) => a.id === stored.accountId) ? stored.accountId : ACCOUNTS[0].id));
  const [prefs, setPrefs] = useState(() => ({ compact: true, compare: true, ...(stored.prefs || {}) }));
  const [notes, setNotes] = useState(() => (stored.notes && typeof stored.notes === "object" ? stored.notes : Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.seedNotes]))));
  const [milestones, setMilestones] = useState(() => (stored.milestones && typeof stored.milestones === "object" ? stored.milestones : {}));
  const [tried, setTried] = useState(() => (stored.tried && typeof stored.tried === "object" ? stored.tried : {}));
  const [themeChoice, setThemeChoice] = useState(() => (stored.theme === "light" || stored.theme === "dark" ? stored.theme : null));
  const [editing, setEditing] = useState(false);
  const theme = themeChoice || systemTheme();

  useEffect(() => {
    saveStore({ accountId, prefs, notes, milestones, tried, theme: themeChoice });
  }, [accountId, prefs, notes, milestones, tried, themeChoice]);

  // Pinta también el fondo de la página para que no asome el color del otro tema
  useEffect(() => {
    const bg = theme === "dark" ? "#000000" : "#F2F2F7";
    document.body.style.background = bg;
    document.documentElement.style.background = bg;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const acc = ACCOUNTS.find((a) => a.id === accountId) || ACCOUNTS[0];
  const milestone = { ...acc.milestone, ...(milestones[acc.id] || {}) };
  const accNotes = Array.isArray(notes[acc.id]) ? notes[acc.id] : [];

  const addNote = (text) =>
    setNotes((prev) => ({
      ...prev,
      [acc.id]: [...(prev[acc.id] || []), { id: `${acc.id}-${Date.now()}`, text, date: shortDate() }],
    }));
  const deleteNote = (id) => setNotes((prev) => ({ ...prev, [acc.id]: (prev[acc.id] || []).filter((n) => n.id !== id) }));
  const changeMilestone = (patch) => setMilestones((prev) => ({ ...prev, [acc.id]: { ...(prev[acc.id] || {}), ...patch } }));
  const resetMilestone = () =>
    setMilestones((prev) => {
      const next = { ...prev };
      delete next[acc.id];
      return next;
    });
  const toggleTried = (id) => setTried((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className={`ig-root min-h-screen ${INK}`} data-theme={theme}>
      <style>{GLOBAL_CSS}</style>
      <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <TopBar
          accountId={accountId}
          onSelect={setAccountId}
          editing={editing}
          onToggleEdit={() => setEditing((e) => !e)}
          prefs={prefs}
          setPrefs={setPrefs}
          theme={theme}
          onToggleTheme={() => setThemeChoice(theme === "dark" ? "light" : "dark")}
        />

        <header className="mb-6 mt-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[2.75rem] font-bold leading-none tracking-[-0.04em] sm:text-6xl">Analíticas</h1>
            <p className={`mt-2.5 text-sm ${MUTED}`}>{todayLabel()}</p>
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <p className="text-sm font-medium">
              {acc.handle}{" "}
              <span className={`font-normal ${MUTED}`}>
                · Periodo: 1 – 31 {PERIOD.short} {PERIOD.year}
              </span>
            </p>
            <span className={`rounded-full border border-dashed px-2.5 py-0.5 text-xs ${DASH} ${MUTED}`}>Datos de ejemplo</span>
          </div>
        </header>

        {editing && (
          <div className={`ig-fade ig-shadow mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${CARD_BG} ${INK2}`}>
            <span className="flex items-center gap-2">
              <Icon name="pencil" className={`h-4 w-4 ${INK}`} />
              Modo edición: cambia el titular, el resumen y la meta de seguidores, o elimina notas de campaña.
            </span>
            <button type="button" onClick={() => setEditing(false)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${ACCENT} ${FOCUS}`}>
              Terminar
            </button>
          </div>
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
          <ContentCard acc={acc} prefs={prefs} />
          <AudienceCard acc={acc} />
          <ActivityCard acc={acc} prefs={prefs} className="md:col-span-2" />
          <RecommendationsCard acc={acc} goal={milestone.goal} tried={tried} onToggleTried={toggleTried} className="md:col-span-2 lg:col-span-3" />
        </main>

        <p className={`mt-8 text-center text-xs ${FAINT}`}>Datos de ejemplo. Conecta la API de Instagram para ver tus métricas reales.</p>
      </div>
    </div>
  );
}
