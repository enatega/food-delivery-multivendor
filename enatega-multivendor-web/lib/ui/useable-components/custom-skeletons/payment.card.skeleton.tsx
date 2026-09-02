export default function PaymentCardSkeleton() {
  return (
    <div className="skeleton-ring flex animate-pulse flex-col items-center justify-center rounded-lg border bg-dispatch-surface p-6">
      <div className="skeleton-surface mb-6 h-24 w-24 rounded-full"></div>
      <div className="skeleton-line mb-2 h-4 w-32 rounded"></div>
      <div className="skeleton-line mb-4 h-3 w-48 rounded"></div>
      <div className="skeleton-line h-8 w-36 rounded"></div>
    </div>
  );
}
