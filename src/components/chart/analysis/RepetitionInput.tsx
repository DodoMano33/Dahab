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
    <div className="w-1/3">
      <label htmlFor="repetitions" className="block text-sm font-medium text-gray-700 mb-2">
        عدد مرات تكرار التحليل
      </label>
      <Input
        id="repetitions"
        type="number"
        min="1"
        value={repetitions}
        onChange={(e) => onRepetitionsChange(e.target.value)}
        placeholder="1"
        className="w-full h-10"
      />
    </div>
  );
};