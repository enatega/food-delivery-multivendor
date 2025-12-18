// Hooks
import { useTranslations } from 'next-intl';

// Interface for component props
export interface IApiErrorAlertProps {
    error: string | null;
    refetch?: () => void | Promise<void>;
    queryName?: string; // New prop for query name
    title?: string;
}

export default function ApiErrorAlert({
    error,
    refetch,
    // variables,
    // queryName,
    title,
}: IApiErrorAlertProps) {
    const t = useTranslations();

    if (!error) return null;

    return (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <svg
                        className="w-5 h-5 text-red-600 dark:text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                        {title || t('GraphQL Error')}
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                        {/* You can display queryName here if needed, e.g. <span className="text-xs block text-red-500 mt-1">Query: {queryName}</span> */}
                    </p>
                </div>
                {refetch && (
                    <button
                        onClick={() => {
                            // Passing variables to refetch as requested
                            refetch();
                        }}
                        className="flex-shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}