import React from "react";

interface DividerProps {
  color?: string;
  thickness?: string;
  margin?: string;
}

const Divider: React.FC<DividerProps> = ({
  color = "border-gray-300",
  thickness = "border-b-2",
  margin = "my-4",
}) => {
  return (
    <div
      role="separator"
      className={`w-full ${thickness} ${color} ${margin}`}
    />
  );
};

export default Divider;
