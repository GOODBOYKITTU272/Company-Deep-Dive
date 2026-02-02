interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-600">
          {description || 'No live data source configured yet.'}
        </p>
      </div>
    </div>
  );
}
