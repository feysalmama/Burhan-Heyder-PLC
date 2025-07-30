export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="h-16 bg-gray-100 animate-pulse rounded" />
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="h-8 bg-gray-100 animate-pulse rounded w-1/3" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
        <div className="h-96 bg-gray-100 animate-pulse rounded" />
      </div>
    </div>
  )
}
