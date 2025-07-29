interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-night-600 mb-4"></div>
      <p className="text-lg md:text-xl font-semibold text-night-600">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
