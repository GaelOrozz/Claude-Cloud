import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Datos de ejemplo (mock). Sustituye ACCOUNTS por la respuesta de    */
/*  tu API/base de datos respetando la misma forma.                    */
/* ------------------------------------------------------------------ */

const PERIOD = { label: "Agosto 2026", month: "agosto", prevMonth: "julio", short: "ago", year: 2026, monthIndex: 7 };
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago"];
const MONTHS_LONG = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto"];

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
const argmax = (arr) => arr.reduce((best, v, i) => (v > arr[best] ? i : best), 0);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function dayLabel(day) {
  const d = new Date(PERIOD.year, PERIOD.monthIndex, day);
  const wd = d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "");
  return `${wd} ${day} ${PERIOD.short}`;
}

function todayLabel() {
  const s = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function shortDate(d = new Date()) {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
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
  chart: (<><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></>),
};

function Icon({ name, className = "h-4 w-4", strokeWidth = 1.75 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Piezas base                                                        */
/* ------------------------------------------------------------------ */

const FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1C1E]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F2F7]";
const SOFT_SHADOW = "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_40px_-18px_rgba(0,0,0,0.10)]";
const INPUT =
  "mt-1.5 w-full rounded-2xl border border-transparent bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] text-[#1C1C1E] outline-none transition placeholder:text-[#AEAEB2] focus:border-[#D1D1D6] focus:bg-white";

function Card({ dark = false, className = "", children }) {
  const skin = dark
    ? "bg-[#1C1C1E] text-white shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-20px_rgba(0,0,0,0.45)]"
    : `bg-white text-[#1C1C1E] ${SOFT_SHADOW}`;
  return <section className={`flex flex-col rounded-[28px] p-6 sm:p-7 ${skin} ${className}`}>{children}</section>;
}

function CardHeader({ title, subtitle, right, dark = false }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className={`text-[17px] font-semibold tracking-[-0.01em] ${dark ? "text-white" : "text-[#1C1C1E]"}`}>{title}</h2>
        {subtitle && <p className={`mt-0.5 text-[13px] ${dark ? "text-white/50" : "text-[#8E8E93]"}`}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function IconBadge({ icon, dark = false }) {
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${dark ? "bg-white/10 text-white/80" : "bg-[#F2F2F7] text-[#3A3A3C]"}`}>
      <Icon name={icon} className="h-[17px] w-[17px]" />
    </span>
  );
}

function Segmented({ options, value, onChange, label, small = false }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex shrink-0 items-center rounded-full bg-[#EBEBF0] p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 ${FOCUS} ${
              small ? "px-3 py-1 text-xs" : "py-1.5 pl-1.5 pr-4 text-sm"
            } ${active ? "bg-white text-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.10)]" : "text-[#6C6C70] hover:text-[#1C1C1E]"}`}
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
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${FOCUS} ${checked ? "bg-[#1C1C1E]" : "bg-[#E5E5EA]"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

function DeltaPill({ value, suffix, dark = false, className = "" }) {
  const up = value >= 0;
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${dark ? "bg-white/10 text-white" : "bg-[#F2F2F7] text-[#1C1C1E]"}`}>
        <Icon name={up ? "arrowUp" : "arrowDown"} className="h-3 w-3" strokeWidth={2.25} />
        {up ? "+" : "−"}
        {Math.abs(value).toFixed(1)}%
      </span>
      {suffix && <span className={`text-xs ${dark ? "text-white/45" : "text-[#8E8E93]"}`}>{suffix}</span>}
    </div>
  );
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-[#EFEFF3] ${className}`}>
      <div className="h-full rounded-full bg-[#1C1C1E] transition-[width] duration-500 ease-out" style={{ width: `${clamp(value, 0, 100)}%` }} />
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
        className={`grid h-9 w-9 place-items-center rounded-full transition ${FOCUS} ${open ? "bg-[#1C1C1E] text-white" : `bg-white text-[#1C1C1E] hover:bg-[#FAFAFC] ${SOFT_SHADOW}`}`}
      >
        <Icon name="sliders" className="h-[17px] w-[17px]" />
      </button>
      {open && (
        <div role="dialog" aria-label="Ajustes de visualización" className="ig-pop absolute right-0 top-11 z-30 w-72 rounded-3xl bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_24px_48px_-12px_rgba(0,0,0,0.20)]">
          <p className="text-[15px] font-semibold">Ajustes</p>
          <p className="mt-4 text-xs font-medium text-[#8E8E93]">Formato de números</p>
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
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2F2F7] pt-4">
            <label htmlFor="pref-compare" className="min-w-0 cursor-pointer">
              <span className="block text-sm font-medium">Comparar con {PERIOD.prevMonth}</span>
              <span className="block text-xs text-[#8E8E93]">Muestra el cambio vs el mes anterior</span>
            </label>
            <Switch id="pref-compare" checked={prefs.compare} onChange={(v) => setPrefs((p) => ({ ...p, compare: v }))} />
          </div>
        </div>
      )}
    </div>
  );
}

function TopBar({ accountId, onSelect, editing, onToggleEdit, prefs, setPrefs }) {
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
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold transition-colors ${active ? "bg-[#1C1C1E] text-white" : "bg-white text-[#6C6C70]"}`}>{a.initial}</span>
              {a.name}
            </>
          ),
        }))}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleEdit}
          aria-pressed={editing}
          className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition ${FOCUS} ${
            editing ? "bg-[#1C1C1E] text-white" : `bg-white text-[#1C1C1E] hover:bg-[#FAFAFC] ${SOFT_SHADOW}`
          }`}
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
/*  Tarjeta 1 · Resumen (oscura)                                       */
/* ------------------------------------------------------------------ */

function MiniStat({ icon, label, value, delta, note }) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl bg-[#2C2C2E] p-3.5">
      <div className="flex items-center gap-1.5 text-white/50">
        <Icon name={icon} className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">{value}</p>
      {delta != null ? (
        <p className="mt-0.5 flex items-center gap-0.5 text-xs text-white/55 tabular-nums">
          <Icon name={delta >= 0 ? "arrowUp" : "arrowDown"} className="h-3 w-3" strokeWidth={2.25} />
          {delta >= 0 ? "+" : "−"}
          {Math.abs(delta).toFixed(1)}%
        </p>
      ) : (
        <p className="mt-0.5 truncate text-xs text-white/40">{note}</p>
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
    <Card dark>
      <CardHeader
        dark
        title="Resumen"
        subtitle={`${PERIOD.label} · ${acc.handle}`}
        right={<span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/75">Mensual</span>}
      />

      <div className="mt-8">
        <p className="text-[13px] font-medium text-white/55">Visualizaciones totales</p>
        <p className={`mt-1.5 font-bold leading-none tracking-[-0.04em] ${viewsText.length > 7 ? "text-[2.6rem]" : "text-[3.5rem]"}`}>{viewsText}</p>
        {prefs.compare && <DeltaPill dark className="mt-3" value={pctChange(acc.views, acc.viewsPrev)} suffix={`vs ${PERIOD.prevMonth}`} />}
      </div>

      <div className="mt-7">
        <p className="text-[13px] font-medium text-white/55">Seguidores netos del mes</p>
        <p className="mt-1.5 text-[2.6rem] font-bold leading-none tracking-[-0.04em]">+{nf.format(Math.round(netAnim))}</p>
        <p className="mt-2.5 text-[13px] text-white/45">{nf.format(acc.followersEnd)} seguidores en total</p>
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

function ListRow({ icon, badge, title, subtitle, right, children }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F2F2F7] text-[#3A3A3C]">
        {badge || <Icon name={icon} className="h-[18px] w-[18px]" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-[15px] font-medium">{title}</p>
          {right && <div className="shrink-0 text-right text-[15px] font-semibold tabular-nums">{right}</div>}
        </div>
        {subtitle && <p className="truncate text-[13px] text-[#8E8E93]">{subtitle}</p>}
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
              <span className="text-xs font-medium text-[#8E8E93]">Titular</span>
              <input id={`ms-title-${acc.id}`} className={INPUT} value={milestone.title} onChange={(e) => onMilestoneChange({ title: e.target.value })} />
            </label>
            <label className="block" htmlFor={`ms-body-${acc.id}`}>
              <span className="text-xs font-medium text-[#8E8E93]">Resumen</span>
              <textarea id={`ms-body-${acc.id}`} rows={3} className={`${INPUT} resize-none leading-relaxed`} value={milestone.body} onChange={(e) => onMilestoneChange({ body: e.target.value })} />
            </label>
            <label className="block" htmlFor={`ms-goal-${acc.id}`}>
              <span className="text-xs font-medium text-[#8E8E93]">Meta de seguidores</span>
              <input id={`ms-goal-${acc.id}`} type="number" min="1" step="100" inputMode="numeric" className={`${INPUT} tabular-nums`} value={milestone.goal} onChange={(e) => onMilestoneChange({ goal: e.target.value })} />
            </label>
            <button type="button" onClick={onMilestoneReset} className={`rounded-full px-1 text-xs font-medium text-[#8E8E93] underline-offset-2 hover:text-[#1C1C1E] hover:underline ${FOCUS}`}>
              Restablecer texto original
            </button>
          </div>
        ) : (
          <>
            <h3 className="mt-5 text-balance text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]">{milestone.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6C6C70]">{milestone.body}</p>
          </>
        )}

        <ul className="mt-4 divide-y divide-[#F2F2F7]">
          <ListRow icon="zap" title="Día récord" subtitle={`${dayLabel(peak + 1)} · interacciones`} right={nf.format(acc.daily[peak])} />
          <ListRow icon="target" title="Meta de seguidores" subtitle={remaining > 0 ? `Faltan ${nf.format(remaining)} para ${nf.format(goal)}` : `Meta de ${nf.format(goal)} cumplida`} right={`${Math.min(100, progress).toFixed(0)}%`}>
            <ProgressBar value={progress} className="mt-2" />
          </ListRow>
        </ul>
      </div>

      {notes.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#AEAEB2]">Notas de campaña</p>
          <ul className="mt-2 space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="ig-fade flex items-start gap-3 rounded-2xl bg-[#F7F7F9] px-3.5 py-3">
                <Icon name="note" className="mt-0.5 h-4 w-4 shrink-0 text-[#8E8E93]" />
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm leading-snug">{n.text}</p>
                  <p className="mt-1 text-xs text-[#8E8E93]">{n.date}</p>
                </div>
                {editing && (
                  <button
                    type="button"
                    onClick={() => onDeleteNote(n.id)}
                    aria-label={`Eliminar nota: ${n.text}`}
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[#6C6C70] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition hover:text-[#1C1C1E] ${FOCUS}`}
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
            className="ig-fade rounded-2xl border border-dashed border-[#C7C7CC] p-3"
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
              className="w-full resize-none bg-transparent px-1 text-sm leading-snug outline-none placeholder:text-[#AEAEB2]"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button type="button" onClick={cancel} className={`rounded-full px-3.5 py-1.5 text-sm font-medium text-[#6C6C70] transition hover:bg-[#F2F2F7] ${FOCUS}`}>
                Cancelar
              </button>
              <button type="submit" disabled={!draft.trim()} className={`rounded-full bg-[#1C1C1E] px-3.5 py-1.5 text-sm font-medium text-white transition disabled:opacity-30 ${FOCUS}`}>
                Guardar nota
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C7C7CC] bg-transparent px-4 py-3.5 text-sm font-medium text-[#6C6C70] transition hover:border-[#8E8E93] hover:bg-[#FAFAFC] hover:text-[#1C1C1E] ${FOCUS}`}
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

      <ul key={`${acc.id}-${sort}`} className="ig-fade mt-3 divide-y divide-[#F2F2F7]">
        {posts.map((p) => (
          <li key={p.id} className="flex items-center gap-3.5 py-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px]" style={{ background: p.tone }} aria-hidden="true">
              <Icon name={TYPE_ICON[p.type]} className="h-[18px] w-[18px] text-white/90" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 break-words text-[15px] font-medium leading-snug">{p.title}</p>
              <p className="mt-0.5 text-[13px] text-[#8E8E93]">
                {TYPE_LABEL[p.type]} · {p.day} {PERIOD.short}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="flex items-center justify-end gap-1 text-[15px] font-semibold tabular-nums">
                <Icon name="eye" className="h-3.5 w-3.5 text-[#AEAEB2]" />
                <span className="sr-only">Visualizaciones:</span>
                {formatNumber(p.views, prefs.compact)}
              </p>
              <p className="mt-0.5 flex items-center justify-end gap-1 text-[13px] text-[#8E8E93] tabular-nums">
                <Icon name="heart" className="h-3.5 w-3.5 text-[#AEAEB2]" />
                <span className="sr-only">Me gusta:</span>
                {formatNumber(p.likes, prefs.compact)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-3">
        <p className="rounded-2xl bg-[#F7F7F9] px-4 py-3 text-[13px] leading-snug text-[#6C6C70]">
          Estas 4 publicaciones generaron el <span className="font-semibold text-[#1C1C1E]">{share.toFixed(0)}%</span> de tus visualizaciones de {PERIOD.month}.
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#AEAEB2]">Género</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          {gender.map((g, i) => (
            <div key={g.label} className={i === 0 ? "" : "text-right"}>
              <p className={`flex items-center gap-1.5 text-[13px] text-[#8E8E93] ${i === 0 ? "" : "justify-end"}`}>
                <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#1C1C1E]" : "bg-[#C7C7CC]"}`} />
                {g.label}
              </p>
              <p className="mt-0.5 text-2xl font-semibold tracking-[-0.02em]">{g.value.toFixed(1)}%</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-1.5 gap-[2px]" role="img" aria-label={gender.map((g) => `${g.label} ${g.value}%`).join(", ")}>
          {gender.map((g, i) => (
            <div key={g.label} className={`h-full rounded-full transition-all duration-500 ${i === 0 ? "bg-[#1C1C1E]" : "bg-[#C7C7CC]"}`} style={{ flex: `${g.value} 1 0%` }} />
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#AEAEB2]">Ubicaciones principales</p>
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
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F2F2F7] text-[11px] font-semibold tracking-wide text-[#3A3A3C]">
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
              <stop offset="0%" stopColor="#1C1C1E" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1C1C1E" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#E5E5EA" : "#F2F2F5"} strokeWidth="1" />
              <text x={pad.l - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill="#AEAEB2" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatAxis(t)}
              </text>
            </g>
          ))}

          {axisLabels.map((l, i) =>
            l ? (
              <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="11" fill={hover === i ? "#1C1C1E" : "#AEAEB2"}>
                {l}
              </text>
            ) : null
          )}

          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke="#1C1C1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {hover != null && <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={base} stroke="#C7C7CC" strokeWidth="1" />}
          <circle cx={x(mark)} cy={y(values[mark])} r="5" fill="#1C1C1E" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      )}

      {hover != null && width > 0 && (
        <div className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-[#1C1C1E] px-3 py-2 text-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.35)]" style={{ left: tipLeft, top: tipTop }}>
          <p className="text-[15px] font-semibold leading-tight tabular-nums">{nf.format(values[hover])}</p>
          <p className="text-[11px] text-white/60">
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
      <p className="text-[13px] text-[#8E8E93]">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tracking-[-0.01em] tabular-nums">{value}</p>
      {sub && <p className="text-xs text-[#AEAEB2]">{sub}</p>}
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
              <span className="text-[13px] text-[#8E8E93]">{daily ? `interacciones en ${PERIOD.month}` : `interacciones en ${PERIOD.year}`}</span>
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
/*  App                                                                */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
html, body { background: #F2F2F7; color-scheme: light; }
.ig-root { font-family: "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
@keyframes igFade { from { opacity: .35; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@keyframes igPop { from { opacity: 0; transform: translateY(-4px) scale(.98); } to { opacity: 1; transform: none; } }
.ig-fade { animation: igFade .4s cubic-bezier(.2,.7,.2,1) both; }
.ig-pop { animation: igPop .18s ease-out both; transform-origin: top right; }
@media (prefers-reduced-motion: reduce) { .ig-fade, .ig-pop { animation: none; } }
`;

export default function InstagramDashboard() {
  const [stored] = useState(loadStore);
  const [accountId, setAccountId] = useState(() => (ACCOUNTS.some((a) => a.id === stored.accountId) ? stored.accountId : ACCOUNTS[0].id));
  const [prefs, setPrefs] = useState(() => ({ compact: true, compare: true, ...(stored.prefs || {}) }));
  const [notes, setNotes] = useState(() => (stored.notes && typeof stored.notes === "object" ? stored.notes : Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.seedNotes]))));
  const [milestones, setMilestones] = useState(() => (stored.milestones && typeof stored.milestones === "object" ? stored.milestones : {}));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    saveStore({ accountId, prefs, notes, milestones });
  }, [accountId, prefs, notes, milestones]);

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

  return (
    <div className="ig-root min-h-screen bg-[#F2F2F7] text-[#1C1C1E]">
      <style>{GLOBAL_CSS}</style>
      <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <TopBar accountId={accountId} onSelect={setAccountId} editing={editing} onToggleEdit={() => setEditing((e) => !e)} prefs={prefs} setPrefs={setPrefs} />

        <header className="mb-6 mt-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[2.75rem] font-bold leading-none tracking-[-0.04em] sm:text-6xl">Analíticas</h1>
            <p className="mt-2.5 text-sm text-[#8E8E93]">{todayLabel()}</p>
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <p className="text-sm font-medium">
              {acc.handle} <span className="font-normal text-[#8E8E93]">· Periodo: 1 – 31 {PERIOD.short} {PERIOD.year}</span>
            </p>
            <span className="rounded-full border border-dashed border-[#C7C7CC] px-2.5 py-0.5 text-xs text-[#8E8E93]">Datos de ejemplo</span>
          </div>
        </header>

        {editing && (
          <div className="ig-fade mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-[#6C6C70] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="flex items-center gap-2">
              <Icon name="pencil" className="h-4 w-4 text-[#1C1C1E]" />
              Modo edición: cambia el titular, el resumen y la meta de seguidores, o elimina notas de campaña.
            </span>
            <button type="button" onClick={() => setEditing(false)} className={`rounded-full bg-[#1C1C1E] px-3.5 py-1.5 text-xs font-medium text-white ${FOCUS}`}>
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
        </main>

        <p className="mt-8 text-center text-xs text-[#AEAEB2]">Datos de ejemplo. Conecta la API de Instagram para ver tus métricas reales.</p>
      </div>
    </div>
  );
}
