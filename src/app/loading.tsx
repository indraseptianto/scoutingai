import { SkeletonCell } from "@/components/ui/SkeletonCell";

export default function Loading() {
  return (
    <div className="py-6 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SkeletonCell size="4x1" />
        <SkeletonCell size="2x2" />
        <SkeletonCell size="1x1" />
        <SkeletonCell size="1x1" />
        <SkeletonCell size="1x1" />
        <SkeletonCell size="1x1" />
        <SkeletonCell size="2x1" />
      </div>
    </div>
  );
}
