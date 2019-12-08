import React from "react";
import { useAsync } from "./useAsync";
import { checkAuthorized } from "./api";
import { Redirect } from "wouter";

export function HasAuth({
  children,
  fallback
}: {
  children: JSX.Element;
  fallback: string;
}) {
  const { value, loading } = useAsync(checkAuthorized);
  if (loading) {
    return <div style={{ display: "none" }} />;
  }
  const isAuthorized = value === true;
  return isAuthorized ? children : <Redirect to={fallback} />;
}
