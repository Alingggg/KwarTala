interface SkeletonProps {
  className?: string;
  tone?: "light" | "dark";
}

const toneClasses = {
  light: "bg-timberwolf-500",
  dark: "bg-white/15",
};

export function Skeleton({ className = "", tone = "light" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md ${toneClasses[tone]} ${className}`}
    />
  );
}

export function SkeletonText({
  className = "w-24",
  tone = "light",
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[0.8em] align-middle animate-pulse rounded ${toneClasses[tone]} ${className}`}
    />
  );
}

export default Skeleton;
