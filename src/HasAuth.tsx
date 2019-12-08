import React from "react";
import { useAsync } from "./useAsync";
import { checkAuthorized } from "./api";
import { Redirect } from "wouter";

export function HasAuth({ children }: { children: JSX.Element }) {
  const { value, loading } = useAsync(checkAuthorized);
  if (loading) {
    return <div style={{ display: "none" }} />;
  }
  const isAuthorized = value === true;
  return isAuthorized ? children : <Redirect to="/login" />;
}
