export const CHECKOUT_SECTION_CLASS =
  "rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_4px_16px_rgba(21,25,20,0.035)] dark:border-gray-700 dark:bg-gray-800";
export const CHECKOUT_FIELD_CLASS =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:border-gray-600";
export const CHECKOUT_FIELD_LABEL_CLASS =
  "block text-sm font-medium text-gray-700 dark:text-gray-200";

export function StepHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="min-w-0">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      {hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
}
