import React from "react";

export default function Spacer({ height = "10px" }: { height: string }) {
  return <div style={{ height }} />;
}
