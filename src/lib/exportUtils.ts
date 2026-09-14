/**
 * Client-side export utilities for the Applicant Tracking Panel.
 * CSV uses native Blob API. XLSX uses SheetJS loaded from CDN.
 * Zero npm dependencies.
 */

export interface ExportableApplication {
  id: string;
  type: string;
  name: string;
  collegeEmail: string;
  rollNumber: string;
  yearOfStudy: string;
  phoneNumber: string;
  positionAppliedFor: string;
  whyRCCTalkies?: string;
  whyJoin?: string;
  status: string;
  createdAt: string;
}

export interface ExportColumn {
  key: keyof ExportableApplication;
  label: string;
  enabled: boolean;
}

export const ALL_EXPORT_COLUMNS: ExportColumn[] = [
  { key: "name", label: "Name", enabled: true },
  { key: "collegeEmail", label: "College Email", enabled: true },
  { key: "rollNumber", label: "Roll Number", enabled: true },
  { key: "yearOfStudy", label: "Year of Study", enabled: true },
  { key: "phoneNumber", label: "Phone Number", enabled: true },
  { key: "type", label: "Application Type", enabled: true },
  { key: "positionAppliedFor", label: "Position / Desk", enabled: true },
  { key: "status", label: "Status", enabled: true },
  { key: "whyRCCTalkies", label: "Why RCC Talkies?", enabled: false },
  { key: "whyJoin", label: "Why Join?", enabled: false },
  { key: "createdAt", label: "Date Applied", enabled: true },
];

/**
 * Escape a CSV cell value — wraps in quotes if it contains commas,
 * quotes, or newlines.
 */
function escapeCSVCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format a date string into a readable format for exports.
 */
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get the cell value for a given application and column key.
 */
function getCellValue(app: ExportableApplication, key: keyof ExportableApplication): string {
  const val = app[key];
  if (val === undefined || val === null) return "";
  if (key === "createdAt") return formatDate(val);
  return String(val);
}

/**
 * Generate a timestamp string for filenames.
 */
function getTimestamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Trigger a file download in the browser.
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── CSV Export ───────────────────────────────────────────────────────────

/**
 * Generate and download a CSV file from applications data.
 */
export function exportCSV(
  applications: ExportableApplication[],
  columns: ExportColumn[]
): void {
  const enabledCols = columns.filter((c) => c.enabled);

  // Header row
  const header = enabledCols.map((c) => escapeCSVCell(c.label)).join(",");

  // Data rows
  const rows = applications.map((app) =>
    enabledCols.map((col) => escapeCSVCell(getCellValue(app, col.key))).join(",")
  );

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `rcc-talkies-applications-${getTimestamp()}.csv`);
}

// ─── XLSX Export (SheetJS from CDN) ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedXLSX: any = null;

/**
 * Dynamically load SheetJS from CDN (cached after first load).
 */
async function loadSheetJS(): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (cachedXLSX) return cachedXLSX;

  // Check if already loaded globally
  if ((window as any).XLSX) { // eslint-disable-line @typescript-eslint/no-explicit-any
    cachedXLSX = (window as any).XLSX; // eslint-disable-line @typescript-eslint/no-explicit-any
    return cachedXLSX;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
    script.onload = () => {
      cachedXLSX = (window as any).XLSX; // eslint-disable-line @typescript-eslint/no-explicit-any
      resolve(cachedXLSX);
    };
    script.onerror = () => reject(new Error("Failed to load SheetJS from CDN"));
    document.head.appendChild(script);
  });
}

/**
 * Generate and download an XLSX file from applications data.
 */
export async function exportXLSX(
  applications: ExportableApplication[],
  columns: ExportColumn[]
): Promise<void> {
  const XLSX = await loadSheetJS();
  const enabledCols = columns.filter((c) => c.enabled);

  // Build data array (header + rows)
  const data = [
    enabledCols.map((c) => c.label),
    ...applications.map((app) =>
      enabledCols.map((col) => getCellValue(app, col.key))
    ),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths for readability
  ws["!cols"] = enabledCols.map((col) => ({
    wch: col.key === "whyRCCTalkies" || col.key === "whyJoin" ? 40 : 20,
  }));

  XLSX.utils.book_append_sheet(wb, ws, "Applications");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `rcc-talkies-applications-${getTimestamp()}.xlsx`);
}
