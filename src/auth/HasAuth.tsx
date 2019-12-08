import React from "react";
import { useAsync } from "../hooks/useAsync";
import { checkAuthorized } from "../api";
import { Redirect } from "wouter";

type HasAuthProps = {
  children: JSX.Element;
  fallback: string;
};

export function HasAuth({ children, fallback }: HasAuthProps) {
  const { value, loading } = useAsync(checkAuthorized);
  if (loading) {
    return <div style={{ display: "none" }} />;
  }
  const isAuthorized = value === true;
  return isAuthorized ? children : <Redirect to={fallback} />;
}
