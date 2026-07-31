export default function PaymentCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center justify-center rounded-lg border dark:bg-dark-950 border-gray-200 bg-gray-100 p-6">
      <div className="mb-6 h-24 w-24 rounded-full bg-gray-300 dark:bg-dark-950"></div>
      <div className="mb-2 h-4 w-32 rounded bg-gray-300 dark:bg-dark-950"></div>
      <div className="mb-4 h-3 w-48 rounded bg-gray-300 dark:bg-dark-950"></div>
      <div className="h-8 w-36 rounded bg-gray-300 dark:bg-dark-950"></div>
    </div>
  );
}
