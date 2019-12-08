// @jsx jsx
import { jsx } from "@emotion/core";
import React from "react";
import { Field } from "./ui/Field";
import styled from "@emotion/styled";
import { useAsyncCall } from "./useAsync";
import { login, signUp } from "./api";
import { Redirect, Link } from "wouter";
import { decodeFormValues } from "./useFormValues";

const Button = styled.button`
  background: var(--primary);
  color: white;
  font-size: var(--fontSize5);
  min-width: 150px;
  min-height: 40px;
  cursor: pointer;
`;

function AuthTemplate({
  children,
  actions,
  label,
  onSubmit,
  error
}: {
  children: React.ReactNode;
  actions: React.ReactNode;
  label: React.ReactNode;
  error: React.ReactNode;
  onSubmit: (values: Record<string, string>) => void;
}) {
  return (
    <div
      css={{
        placeSelf: "center center",
        width: 485,
        fieldset: {
          marginBottom: 40
        }
      }}
    >
      <div
        css={{
          fontSize: "var(--fontSize1)",
          textAlign: "center",
          marginBottom: 60
        }}
      >
        {label}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(decodeFormValues(e.target as HTMLFormElement));
        }}
      >
        <div style={{ color: "red" }}>{error}</div>

        {children}
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {actions}
        </div>
      </form>
    </div>
  );
}
export function SignUp() {
  const { error, call, loading, value } = useAsyncCall(signUp);
  if (value) {
    return <Redirect to="/ideas" />;
  }
  return (
    <AuthTemplate
      error={error ? (error as any).reason : ""}
      label="Sign up"
      onSubmit={call}
      actions={
        <React.Fragment>
          <Button type="submit">{loading ? "Loading..." : "Sign up"}</Button>
          <span>
            Already have an account? <Link href="/login">{" Log in"}</Link>
          </span>
        </React.Fragment>
      }
    >
      <Field name="name" type="text" label="Name" errorLabel="Invalid" />
      <Field name="email" type="email" label="Email" errorLabel="Invalid" />
      <Field
        name="password"
        type="password"
        label="Password"
        errorLabel="Password should be at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number"
        pattern={`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*-]).{8,}$`}
      />
    </AuthTemplate>
  );
}

export function Login() {
  const { error, call, loading, value } = useAsyncCall(login);
  if (value && !error) {
    return <Redirect to="/ideas" />;
  }
  return (
    <AuthTemplate
      error={error ? (error as any).reason : ""}
      label="Login"
      onSubmit={call}
      actions={
        <React.Fragment>
          <Button type="submit">{loading ? "Loading..." : "Login"}</Button>
          <span>
            Don’t have an account?{" "}
            <Link href="/signup">{" Create an account"}</Link>
          </span>
        </React.Fragment>
      }
    >
      <Field
        type="email"
        name="email"
        label="Email"
        errorLabel="Invalid email"
      />
      <Field
        type="password"
        name="password"
        label="Password"
        errorLabel="Invalid"
      />
    </AuthTemplate>
  );
}
