import React from "react";

export default function SizeBox({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  return <div style={{ height, width }} />;
}
