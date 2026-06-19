export function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border/60 overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-secondary" />
      <div className="h-8 bg-secondary/60" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-1/3 bg-secondary rounded" />
        <div className="h-4 w-full bg-secondary rounded" />
        <div className="h-4 w-2/3 bg-secondary rounded" />
        <div className="h-5 w-1/4 bg-secondary rounded mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-3 w-1/3 bg-secondary rounded mb-6" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-[4/5] bg-secondary" />
        <div className="space-y-4">
          <div className="h-6 w-24 bg-secondary rounded" />
          <div className="h-10 w-4/5 bg-secondary rounded" />
          <div className="h-12 w-1/3 bg-secondary rounded" />
          <div className="space-y-2">
            <div className="h-3 bg-secondary rounded" />
            <div className="h-3 bg-secondary rounded" />
            <div className="h-3 w-3/4 bg-secondary rounded" />
          </div>
          <div className="h-14 bg-secondary rounded" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 bg-secondary rounded" />
            <div className="h-10 bg-secondary rounded" />
            <div className="h-10 bg-secondary rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
