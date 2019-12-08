import React, { useState, useRef } from "react";
import PenIcon from "../assets/pen.png";
import CancelIcon from "../assets/cancel.png";
import BinIcon from "../assets/bin.png";
import ConfirmIcon from "../assets/confirm.png";
import LoaderIcon from "../assets/loader.gif";

import styled from "@emotion/styled";
import { Icon } from "../ui/Icon";
import { useDialog } from "../ui/Dialog";
import { useFormValues, decodeFormValues } from "../hooks/useFormValues";
import { Idea, removeIdea, updateIdea, saveIdea } from "../api";
import { useAsyncCallback } from "../hooks/useAsync";

const StyledRow = styled.form`
  display: contents;
  position: relative;
  & > span {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 40px;
  }
  & > .main-content {
    text-align: start;
    place-self: center start;
    position: relative;
    padding-left: 18px;
  }
  & > .main-content::before {
    position: absolute;
    left: 0;
    width: 10px;
    height: 10px;
    top: 50%;
    z-index: -1;
    content: "";
    border-radius: 50%;
    transform: translateY(-33%);
    background: var(--secondary);
    opacity: 0.4;
  }
  & > .actions {
    opacity: 0;
  }
  :hover {
    .actions {
      opacity: 1;
    }
  }
  .loader {
    position: absolute;
    grid-area: 1/1 / z/z;
  }
  :invalid {
    button[type="submit"] {
      pointer-events: none;
      opacity: 0.5;
    }
  }
`;

const StyledNumberInput = styled.input`
  font-size: var(--fontSize5);
  max-width: 47px;
  margin: auto;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
  height: 100%;
  padding: 0px 2px 0px 12px;
  :invalid {
    border-color: red;
  }
`;

const TextInput = styled.input`
  font-size: var(--fontSize5);
  margin: auto;
  padding: 0px 3px;
  height: 100%;
  width: 80%;
  border: none;
  border-bottom: 1px solid var(--secondary);
`;

type NumberFieldProps = {
  editable: boolean;
  initialValue?: number;
  name: string;
};
function NumberField({ editable, initialValue, name }: NumberFieldProps) {
  return (
    <span>
      <StyledNumberInput
        min="1"
        max="10"
        // field should always be preset otherwise we won't be able to calculate avg
        style={{ display: editable ? "block" : "none" }}
        type="number"
        defaultValue={initialValue}
        name={name}
      />
      {!editable ? initialValue : ""}
    </span>
  );
}

function ComputedField({
  formRef
}: {
  formRef: React.RefObject<HTMLFormElement>;
}) {
  const values = useFormValues(formRef);
  const avg =
    ["impact", "ease", "confidence"].reduce(
      (acc, el) => acc + (Number(values[el]) || 0),
      0
    ) / 3;
  // multiply and dive to get nice number like 16.4 or 16
  // .toFixed returns 10.00 which looks ugly
  return <span> {Math.ceil(avg * 10) / 10}</span>;
}

type ItemProps = {
  values: Partial<Idea>;
  isCreate?: boolean;
  onSave?: (values: Record<string, string>) => void;
  onRemove?: () => void;
};

// todo we don't have all the possible states here
// for instance there might be a lot of network connection errors or something else
// these issues are rare but we need to provide some user feedback
export function Item({
  isCreate = false,
  onSave,
  values,
  onRemove
}: ItemProps) {
  const [isEditable, setEditable] = useState(isCreate);
  const formRef = useRef<HTMLFormElement>(null);

  const removeAsync = useAsyncCallback(
    removeIdea,
    () => onRemove && onRemove()
  );
  const updateAsync = useAsyncCallback(updateIdea, () => {
    onSave &&
      onSave({ ...values, ...decodeFormValues(formRef.current!) } as any);
    setEditable(false);
  });

  const createAsync = useAsyncCallback(saveIdea, values => {
    if (isCreate === true) {
      onSave && onSave(values);
      setEditable(false);
    }
  });

  function onSubmit(formValues: Record<string, string>) {
    if (isCreate) {
      createAsync.call(formValues);
    } else {
      updateAsync.call({ id: values.id, data: formValues });
    }
  }
  const { open, dialog, close } = useDialog(res => {
    if (res === "ok") {
      removeAsync.call(values.id);
    }
    close();
  });

  function handleItemRemove() {
    setEditable(false);
    if (isCreate) {
      onRemove && onRemove();
    }
  }

  return (
    <StyledRow
      ref={formRef}
      key={String(isEditable)}
      style={{
        pointerEvents: removeAsync.loading ? "none" : "unset"
      }}
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      {dialog}
      <span className="main-content">
        {isEditable ? (
          <TextInput
            required
            name="content"
            type={"text"}
            placeholder="Your idea"
            defaultValue={values.content}
          />
        ) : (
          values.content
        )}
      </span>
      <NumberField
        name="impact"
        editable={isEditable}
        initialValue={values.impact}
      />
      <NumberField
        name="ease"
        editable={isEditable}
        initialValue={values.ease}
      />
      <NumberField
        name="confidence"
        editable={isEditable}
        initialValue={values.confidence}
      />
      <ComputedField formRef={formRef} />
      {!isEditable && (
        <span className="actions">
          <Icon
            icon={PenIcon}
            size={20}
            onClick={() => {
              setEditable(true);
            }}
          />
          <Icon
            onClick={open}
            icon={BinIcon}
            size={20}
            style={{ marginLeft: 15 }}
          />
        </span>
      )}
      {isEditable && (
        <span className="edit-actions">
          <button type="submit">
            <Icon
              icon={
                createAsync.loading || updateAsync.loading
                  ? LoaderIcon
                  : ConfirmIcon
              }
              size={20}
              onClick={() => {
                if (createAsync.loading) {
                  return;
                }
                onSubmit(decodeFormValues(formRef.current!));
              }}
            />
          </button>
          <Icon
            icon={removeAsync.loading ? LoaderIcon : CancelIcon}
            size={20}
            style={{ marginLeft: 15 }}
            onClick={handleItemRemove}
          />
        </span>
      )}
    </StyledRow>
  );
}
