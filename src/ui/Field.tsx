import React from "react";
import styled from "@emotion/styled";

const FormGroup = styled.fieldset`
  position: relative;
  margin-bottom: 20px;
  padding: 0;
  border: none;
  font-size: var(--font4);
  label {
    position: absolute;
    top: 0;
    left: 0;
    color: rgba(0, 0, 0, 0.87);
    padding: 1rem 0;
    pointer-events: none;
    transition: all 0.25s ease;
  }

  .border {
    transition: all 0.3s ease-in;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    background-color: #2196f3;
    height: 2px;
    transition: all 0.125s ease;
  }

  input,
  textarea {
    background-color: transparent;
    padding: 0.875rem 0;
    font-size: 1rem;
    border: 0;
    border-bottom: 1px solid #ccc;
    width: 100%;

    & ~ .border {
      display: block;
    }

    &:focus {
      outline: 0;
    }
    &:focus ~ .border {
      width: 100%;
    }
  }
  textarea {
    min-height: 7rem;
  }

  .validation {
    position: absolute;
    opacity: 0;
    font-size: 12px;
    font-family: sans-serif;
    color: crimson;
    transition: opacity;
    width: 100%;
    left: 0;
    bottom: -18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  input:required:valid ~ .border {
    background-color: var(--primary);
    display: block;
    opacity: 1;
    width: 100%;
  }

  input:required:invalid:not(:placeholder-shown) ~ .border {
    background-color: red;
    display: block;
    opacity: 1;
    width: 100%;
  }

  input:required:invalid:not(:placeholder-shown) ~ .validation {
    opacity: 1;
  }
`;

export function Field({
  label,
  errorLabel,
  ...rest
}: React.HTMLAttributes<HTMLInputElement> & {
  label: string;
  type: string;
  errorLabel?: string;
  name: string;
  pattern?: string;
}) {
  return (
    <FormGroup>
      <input {...rest} placeholder={label} required />
      <span className="border"></span>
      <span className="validation">{errorLabel}</span>
    </FormGroup>
  );
}
