import React from "react";
import { Global } from "@emotion/core";

export const theme = {
  primary: "rgba(0,168,67,1)",
  secondary: "rgb(42,56,66,1)",
  borderColor: "rgba(69,94,112,1)",
  textColor: "rgba(42,56,66,1)",
  placeholderColor: "rgba(42,56,66,0.6)",
  fontSize1: "40px",
  fontSize2: "28px",
  fontSize3: "24px",
  fontSize4: "20px",
  fontSize5: "16px",
  fontSize6: "14px",
  fontButton: "18px"
} as const;

function toVars(obj: typeof theme) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc["--" + k] = v as string;
    return acc;
  }, {} as Record<string, string>);
}
export function Theme({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Global
        styles={{
          body: toVars(theme) as any
        }}
      />
      {children}
    </>
  );
}
