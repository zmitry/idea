// @jsx jsx
import { jsx } from "@emotion/core";
import React from "react";

export function Icon({
  size,
  icon,
  style,
  ...rest
}: React.HTMLAttributes<HTMLImageElement> & {
  size: number;
  icon: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      {...rest}
      width={size}
      height={size}
      src={icon}
      alt="icon"
      style={style}
      css={{
        objectFit: "contain",
        cursor: "pointer",
        opacity: 0.9,
        ":hover": {
          opacity: 1
        }
      }}
    />
  );
}
