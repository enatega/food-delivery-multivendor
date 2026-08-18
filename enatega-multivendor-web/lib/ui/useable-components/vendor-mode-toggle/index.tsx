"use client";

import { APP_MODES, type AppMode, useAppMode } from "@/lib/mode";
import useUser from "@/lib/hooks/useUser";

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

const MODE_DETAILS = {
  [APP_MODES.MULTI]: {
    label: "Multi Vendor",
    description: "Explore nearby restaurants and stores",
  },
  [APP_MODES.SINGLE]: {
    label: "Single Vendor",
    description: "Shop directly from one marketplace",
  },
} as const;

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
      aria-label="Delivery service"
      aria-busy={isSwitchingMode}
      className={`grid items-stretch gap-1.5 rounded-[18px] border border-gray-200/90 bg-gray-100/80 p-1.5 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/80 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_6px_18px_rgba(0,0,0,0.18)] ${
        compact
          ? "w-[244px] max-w-full grid-cols-[0.95fr_1fr]"
          : "w-full max-w-[540px] grid-cols-2"
      }`}
    >
      {([APP_MODES.MULTI, APP_MODES.SINGLE] as const).map((itemMode) => {
        const selected = itemMode === mode;
        const details = MODE_DETAILS[itemMode];

        return (
          <button
            key={itemMode}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={details.label}
            disabled={isSwitchingMode || isModeSwitchBlocked}
            onClick={() => void requestSwitch(itemMode)}
            className={`group relative isolate flex min-w-0 items-center overflow-hidden rounded-[13px] text-start transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-800 ${
              compact ? "h-9 justify-center gap-1.5 px-2" : "gap-3 px-3 py-2.5"
            } ${
              selected
                ? "bg-gradient-to-br from-primary-color to-primary-dark text-white shadow-[0_5px_14px_rgba(90,193,47,0.3)]"
                : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            {selected && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2 top-0 h-px bg-white/55"
              />
            )}

            <span
              aria-hidden="true"
              className={`flex shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                compact ? "h-5 w-5 p-1" : "h-9 w-9 p-2"
              } ${
                selected
                  ? "bg-white/20 text-white shadow-inner"
                  : "bg-white text-gray-500 shadow-sm ring-1 ring-gray-200/70 group-hover:text-primary-dark dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600"
              }`}
            >
              <ModeIcon mode={itemMode} />
            </span>

            <span className={compact ? "min-w-0" : "min-w-0 flex-1"}>
              <span
                className={`block whitespace-nowrap font-semibold ${
                  compact ? "text-[11px] leading-none" : "text-sm leading-5"
                }`}
              >
                {details.label}
              </span>
              {!compact && (
                <span
                  className={`mt-0.5 block truncate text-[11px] leading-4 ${
                    selected
                      ? "text-white/80"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {details.description}
                </span>
              )}
            </span>

            {isSwitchingMode && selected && (
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
