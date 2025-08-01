import LoadingSpinner from "./LoadingSpinner";

interface LoadingOverlayProps {
  message?: string;
}

function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-md">
      <LoadingSpinner message={message} />
    </div>
  );
}

export default LoadingOverlay;
