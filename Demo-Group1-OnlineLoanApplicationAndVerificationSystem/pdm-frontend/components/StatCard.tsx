interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export default function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {trend && (
          <div
            className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
              trend.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
