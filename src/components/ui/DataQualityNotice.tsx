"use client";

type DataQualityNoticeProps = {
  visible: boolean;
  title?: string;
  message: string;
  details?: string;
};

export function DataQualityNotice({
  visible,
  title = "Data quality notice",
  message,
  details,
}: DataQualityNoticeProps) {
  if (!visible) return null;

  return (
    <div
      className="rounded-xl border p-3 text-sm"
      style={{
        background: "var(--color-surface-2)",
        borderColor: "var(--color-warning)",
        color: "var(--color-text)",
      }}
    >
      <div className="font-semibold" style={{ color: "var(--color-warning)" }}>
        {title}
      </div>
      <p className="mt-1">{message}</p>
      {details && (
        <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
          {details}
        </p>
      )}
    </div>
  );
}
