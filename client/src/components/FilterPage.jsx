import { useWorkersStore } from "@/store/useWorkersStore";
import { Button } from "./ui/button.jsx";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label.jsx";

// Filter options array with no types
const filterOptions = [
  { id: "Painter", label: "Painter" },
  { id: "Carpenter", label: "Carpenter" },
  { id: "Labour", label: "Labour" },
  { id: "Trowel", label: "Trowel" },
];
const FilterPage = () => {
  const { setAppliedFilter, appliedFilter, resetAppliedFilter } = useWorkersStore();
  return (
    <div className="md:w-72 bg-gray-50 dark:bg-gray-900 p-5 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg text-gray-900 dark:text-white">Filter by Occupation</h1>
        <Button variant="link" className="text-red-500" onClick={resetAppliedFilter}>Reset</Button>
      </div>
      {filterOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-3 my-3">
          <Checkbox
            id={option.id}
            checked={appliedFilter.includes(option.label)}
            onClick={() => setAppliedFilter(option.label)}
          />
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default FilterPage;
