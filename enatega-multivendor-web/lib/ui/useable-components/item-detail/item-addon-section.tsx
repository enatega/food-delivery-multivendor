// Interface
import { AddonSectionProps } from "@/lib/utils/interfaces";

/**
 * `ItemDetailSection` is a generic component that renders either radio buttons or checkboxes
 * based on the `multiple` prop. It supports single or multiple selection.
 *
 * @template T - The type of the option items, which must include an `_id` field.
 *
 * @param {string} title - The title of the section.
 * @param {T[]} addonOptions - The list of options to choose from.
 * @param {string} name - The name attribute for radio or checkbox inputs.
 * @param {boolean} [multiple=false] - If true, allows multiple selections.
 * @param {T | null} singleSelected - The currently selected option
 * @param {Dispatch<SetStateAction<T | null>>} onSingleSelect - Callback function when selection changes.
 * @param {T[] | null} multiSelected - The currently selected options
 * @param {Dispatch<SetStateAction<T | null>>} onMultiSelect - Callback function when multi-select changes
 *
 * @returns {JSX.Element} The rendered component.
 */

export const ItemDetailAddonSection = <
  T extends {
    _id: string;
    options?: {
      _id: string;
      title: string;
      description: string;
      price: number;
    }[];
    title?: string;
    description?: string;
    quantityMinimum?: number;
    quantityMaximum?: number;
  },
>({
  title,
  addonOptions,
  name,
  // multiple = false,
  // multiSelected,
  // onMultiSelect,
}: AddonSectionProps<T>): React.JSX.Element => {
  return (
    <div className="mb-4">
      <h3 className="font-inter font-bold text-[14px] md:text-[16px] lg:text-[18px] leading-[20px] md:leading-[22px]">
        {title}
      </h3>
      <div className="mt-2 space-y-2">
        {addonOptions?.options?.map((option) => (
          <label
            key={option._id}
            className="flex items-center gap-x-2 w-full cursor-pointer"
          >
            {/* Hidden Default Radio */}
            <input
              type={
                (
                  addonOptions.quantityMinimum === 1 &&
                  addonOptions.quantityMaximum === 1
                ) ?
                  "radio"
                : "checkbox"
              }
              name={name}
              // checked={false}
            />

            {/* Label & Price */}
            <div className="flex justify-between items-center w-full">
              <span className="text-sm text-gray-900">{option.title}</span>
              <span className="text-sm text-gray-700">${option.price}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
