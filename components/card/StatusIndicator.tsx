interface StatusIndicatorProps {
    status: string;
    onStatusClick: () => void;
  }
  
  export default function StatusIndicator({
    status,
    onStatusClick
  }: StatusIndicatorProps) {
    return (
      <div className="flex items-center mb-2">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
        <span onClick={onStatusClick} className="text-gray-600 text-sm cursor-pointer">
          {status}
        </span>
      </div>
    );
  }