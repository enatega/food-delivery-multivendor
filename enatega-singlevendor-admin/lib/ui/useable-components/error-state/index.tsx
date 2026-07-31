'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationCircle,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';

interface IErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  loadingLabel?: string;
  loading?: boolean;
}

const ErrorState = ({
  title,
  message,
  onRetry,
  retryLabel = 'Retry',
  loadingLabel = 'Loading...',
  loading = false,
}: IErrorStateProps) => {
  return (
    <div className="flex h-[calc(100vh-200px)]  items-center justify-center p-6">
      <div className="w-full rounded-lg border-2 border-red-500 bg-red-50 p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="h-10 w-10 text-red-600"
            />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-red-800">{title}</h3>
          <div className="mb-6 w-full max-w-2xl rounded-md border border-red-200 bg-white p-4">
            <p className="text-sm font-medium text-red-700">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <ProgressSpinner
                    className="h-4 w-4"
                    strokeWidth="6"
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  <span>{loadingLabel}</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faRotate} className="h-4 w-4" />
                  {retryLabel}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
