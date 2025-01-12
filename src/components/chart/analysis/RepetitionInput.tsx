import { Input } from "@/components/ui/input";

interface RepetitionInputProps {
  repetitions: string;
  onRepetitionsChange: (value: string) => void;
}
export const RepetitionInput = ({
  repetitions,
  onRepetitionsChange,
}: RepetitionInputProps) => {
  return (
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 max-w-[600px] w-full">
      <div className="flex items-center space-x-4">
        <label htmlFor="repetitions" className="text-sm font-medium text-gray-700">
          عدد مرات تكرار التحليل
        </label>
        <Input
          id="repetitions"
          type="number"
          min="1"
          value={repetitions}
          onChange={(e) => onRepetitionsChange(e.target.value)}
          placeholder="1"
          className="w-full"
        />
      </div>
    </div>
  );
};
