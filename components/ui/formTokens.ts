/**
 * Design tokens for the form system.
 *
 * Accent classes are declared as complete literal strings (never composed at
 * runtime) so Tailwind's source scanner always emits them. Every form
 * primitive reads from these maps, which keeps section intent consistent:
 * indigo = article content, sky = media, amber = layout/assignment,
 * emerald = publication state.
 */
export type FormAccent = "indigo" | "amber" | "sky" | "emerald";

/** Uppercase micro-label, with focus-within progression driven by a `group`. */
export const ACCENT_LABEL: Record<FormAccent, string> = {
  indigo: "text-indigo-700 group-focus-within:text-indigo-900",
  amber: "text-amber-700 group-focus-within:text-amber-900",
  sky: "text-sky-800 group-focus-within:text-sky-950",
  emerald: "text-emerald-700 group-focus-within:text-emerald-900",
};

/** Focus ring + border colour for controls. */
export const ACCENT_CONTROL: Record<FormAccent, string> = {
  indigo: "focus:border-indigo-500 focus:ring-indigo-500/10",
  amber: "focus:border-amber-500 focus:ring-amber-500/10",
  sky: "focus:border-sky-500 focus:ring-sky-500/10",
  emerald: "focus:border-emerald-500 focus:ring-emerald-500/10",
};

/** Tinted strip behind a section header. */
export const ACCENT_HEADER: Record<FormAccent, string> = {
  indigo: "bg-slate-100/70",
  amber: "bg-amber-50/60",
  sky: "bg-sky-50/60",
  emerald: "bg-emerald-50/50",
};

/** Subtle contextual gradient for the section body. */
export const ACCENT_SURFACE: Record<FormAccent, string> = {
  indigo: "from-slate-50/80 via-white to-slate-50/40",
  amber: "from-amber-50/40 via-white to-amber-50/20",
  sky: "from-sky-50/30 via-white to-slate-50/40",
  emerald: "from-emerald-50/50 via-white to-emerald-50/30",
};

export const ACCENT_TITLE: Record<FormAccent, string> = {
  indigo: "text-slate-900",
  amber: "text-amber-950",
  sky: "text-sky-950",
  emerald: "text-emerald-950",
};

export const ACCENT_SUBTEXT: Record<FormAccent, string> = {
  indigo: "text-slate-500",
  amber: "text-amber-800/70",
  sky: "text-sky-800/70",
  emerald: "text-emerald-800/70",
};

export const ACCENT_BORDER_HOVER: Record<FormAccent, string> = {
  indigo: "hover:border-slate-300",
  amber: "hover:border-amber-300",
  sky: "hover:border-sky-300",
  emerald: "hover:border-emerald-300",
};

export const ACCENT_HINT: Record<FormAccent, string> = {
  indigo: "text-slate-400",
  amber: "text-amber-700/60",
  sky: "text-sky-700/60",
  emerald: "text-emerald-700/60",
};

/** Shared control surface for inputs, selects and textareas. */
export const CONTROL_BASE =
  "w-full rounded-xl border border-slate-200/90 bg-slate-50/60 shadow-2xs outline-none " +
  "text-sm font-semibold text-slate-900 transition-all duration-200 " +
  "placeholder:font-normal placeholder:text-slate-400 " +
  "focus:bg-white focus:text-slate-950 focus:ring-4 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/** Error treatment shared by every control. */
export const CONTROL_ERROR =
  "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10";

/** Section shell: rounded card with tinted gradient body. */
export const SECTION_SHELL =
  "overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b shadow-sm " +
  "transition-all duration-300 hover:shadow-md";

export const SECTION_HEADER =
  "border-b border-slate-200/80 px-6 py-5 sm:px-8";

export const SECTION_TITLE =
  "text-base font-bold tracking-tight";

export const SECTION_SUBTEXT =
  "mt-0.5 text-xs font-medium";

export const SECTION_BODY = "space-y-6 p-6 sm:p-8";

/** Dashed media drop region shared by every upload zone. */
export const FILE_DROP =
  "group/drop rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/20 p-6 text-center " +
  "transition-all duration-200 hover:border-sky-300 hover:bg-sky-50/40";

export const FILE_DROP_LABEL = "block cursor-pointer";

export const FILE_DROP_TITLE = "mt-3 block text-sm font-bold text-slate-900";
export const FILE_DROP_HINT = "mt-1 block text-xs font-medium text-slate-500";

/** Bottom action toolbar: separators plus consistent spacing. */
export const ACTION_ROW =
  "flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4";

export const ACTION_GROUP = "flex flex-wrap items-center gap-3";

/** Canonical button geometry from the design system. */
export const BUTTON_BASE = "rounded-xl px-6 py-2.5 text-xs font-bold tracking-wide";

