"use client";

import { APP_MODES, type AppMode, useAppMode } from "@/lib/mode";
import useUser from "@/lib/hooks/useUser";
import { useTranslations } from "next-intl";

function ModeIcon({ mode }: { mode: AppMode }) {
  if (mode === APP_MODES.MULTI) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="2"
          fill="currentColor"
          opacity="0.72"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="2"
          fill="currentColor"
          opacity="0.72"
        />
        <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5V20h16v-9.5M3 9l2-5h14l2 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 9c0 1.4 1.1 2.5 2.5 2.5S8 10.4 8 9c0 1.4 1.1 2.5 2.5 2.5S13 10.4 13 9c0 1.4 1.1 2.5 2.5 2.5S18 10.4 18 9c0 1.4 1.1 2.5 2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function VendorModeToggle({
  compact = false,
}: {
  compact?: boolean;
}) {
  const {
    mode,
    isModeToggleEnabled,
    singleVendorAvailable,
    isModeSwitchBlocked,
    isSwitchingMode,
    switchMode,
  } = useAppMode();
  const t = useTranslations();
  const { cartCount, orders = [] } = useUser();

  if (!isModeToggleEnabled || !singleVendorAvailable) return null;
  const activeStatuses = new Set(["PENDING", "PICKED", "ACCEPTED", "ASSIGNED"]);
  const hasActiveOrder = orders.some((order) =>
    activeStatuses.has(order?.orderStatus),
  );

  const requestSwitch = async (next: AppMode) => {
    if (next === mode || isSwitchingMode) return;
    if (isModeSwitchBlocked) {
      window.alert(
        "Please wait until the payment or order request finishes before switching services.",
      );
      return;
    }
    if (
      (cartCount > 0 || hasActiveOrder) &&
      !window.confirm(
        "Your cart and active orders will remain in this service. Switch back to continue checkout or tracking. Switch now?",
      )
    )
      return;
    await switchMode(next);
  };

  return (
    <div
      role="radiogroup"
      aria-label={t("delivery_label")}
      aria-busy={isSwitchingMode}
      className={`grid items-stretch gap-1 rounded-xl bg-dispatch-map p-1 dark:bg-gray-800 ${
        compact
          ? "w-[220px] max-w-full grid-cols-2"
          : "w-full max-w-[480px] grid-cols-2"
      }`}
    >
      {([APP_MODES.MULTI, APP_MODES.SINGLE] as const).map((itemMode) => {
        const selected = itemMode === mode;
        const label =
          itemMode === APP_MODES.MULTI ? t("tab_restaurants") : t("tab_store");

        return (
          <button
            key={itemMode}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            disabled={isSwitchingMode || isModeSwitchBlocked}
            onClick={() => void requestSwitch(itemMode)}
            className={`group relative flex min-w-0 items-center justify-center overflow-hidden rounded-lg text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color disabled:cursor-not-allowed disabled:opacity-60 ${
              compact ? "h-9 gap-1.5 px-2" : "gap-2 px-3 py-2.5"
            } ${
              selected
                ? "bg-primary-light text-primary-dark ring-1 ring-primary-color/35 dark:bg-primary-color/15"
                : "text-dispatch-muted hover:bg-dispatch-surface hover:text-dispatch-ink dark:hover:bg-gray-700"
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex shrink-0 items-center justify-center transition-colors ${compact ? "h-4 w-4" : "h-5 w-5"} ${selected ? "text-primary-dark" : "text-dispatch-muted"}`}
            >
              <ModeIcon mode={itemMode} />
            </span>

            <span className={compact ? "min-w-0" : "min-w-0 flex-1"}>
              <span
                className={`block truncate font-medium ${
                  compact ? "text-[11px] leading-none" : "text-sm leading-5"
                }`}
              >
                {label}
              </span>
            </span>

            {isSwitchingMode && selected && (
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-primary-color/30 border-t-primary-dark"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
