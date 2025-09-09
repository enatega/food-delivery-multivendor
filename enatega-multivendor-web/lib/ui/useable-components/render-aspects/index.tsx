import { ratingAspects } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import { Button } from "primereact/button";
import { twMerge } from "tailwind-merge";

// Aspect button component - Toggleable buttons for rating aspects (Food quality, delivery time, etc)
const AspectButton = ({
  aspect,
  selected,
  onToggle,
}: {
  aspect: string; // Aspect text (e.g., "Food quality")
  selected: boolean; // Whether this aspect is currently selected
  onToggle: (aspect: string) => void; // Toggle callback
}) => (
  <Button
    onClick={() => onToggle(aspect)}
    className={twMerge(
      "px-4 py-2 rounded-full border border-gray-400  text-sm font-medium transition-colors",
      selected
        ? "bg-[#5AC12F] text-white border-green-500" // Selected style
        : "bg-white text-gray-700 border-gray-400 hover:bg-gray-50" // Unselected style
    )}
  >
    {aspect}
  </Button>
);

// Render the aspects selection UI (reused in both step 2 and 3)
function RenderAspects({
  selectedAspects,
  handleAspectToggle,
}: {
  selectedAspects: string[]; // Array of selected aspects
  handleAspectToggle: (aspect: string) => void; // Toggle callback
}) {
  const t = useTranslations()
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {ratingAspects?.map((aspect) => (
        <AspectButton
          key={aspect}
          aspect={t(aspect)}
          selected={selectedAspects.includes(aspect)}
          onToggle={handleAspectToggle}
        />
      ))}
    </div>
  );
}
export default RenderAspects;
