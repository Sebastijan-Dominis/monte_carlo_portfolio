interface ErrorDisplayProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

function ErrorDisplay({ error, setError }: ErrorDisplayProps) {
  return (
    <div className="md:mt-4 md:text-lg lg:mt-8 lg:text-xl xl:mt-12 2xl:text-2xl">
      <button
        className="ml-2 text-[#d2d2d2] md:ml-6 lg:ml-8 xl:ml-10"
        onClick={() => setError("")}
      >
        &larr; Back
      </button>
      <div className="flex flex-col items-center gap-6 text-center text-[#d2d2d2]">
        <h1 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
          An error occured
        </h1>
        <p className="lg:mt-4 2xl:mt-8">{error}</p>
      </div>
    </div>
  );
}

export default ErrorDisplay;
