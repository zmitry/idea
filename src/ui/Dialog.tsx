import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";

const DialogContent = styled.div`
  background: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  margin: auto;
  min-height: 250px;
  min-width: 400px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  place-items: center center;
  .ok-button {
    float: right;
    color: var(--primary);
  }
`;
const DialogOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
`;

const Button = styled.button`
  max-width: 100px;
  max-height: 24px;
  font-size: var(--fontButton);
  text-transform: uppercase;
  border: none;
  padding: 0;
  opacity: 0.9;
  font-weight: 500;
  :hover {
    opacity: 1;
  }
`;

// TODO it should be reuseable but there is not too much sense making it like that if we have only one alert
export function Dialog({
  onClick
}: {
  onClick: (res: "ok" | "cancel") => void;
}) {
  return ReactDOM.createPortal(
    <DialogOverlay
      onClick={() => {
        onClick("cancel");
      }}
    >
      <DialogContent
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            fontSize: "var(--fontSize3)"
          }}
        >
          Are you sure?
        </div>
        <span> This idea will be permanently deleted.</span>
        <div style={{ width: 200 }}>
          <Button
            onClick={() => {
              onClick("cancel");
            }}
          >
            Cancel
          </Button>
          <Button
            className="ok-button"
            onClick={() => {
              onClick("ok");
            }}
            style={{}}
          >
            Ok
          </Button>
        </div>
      </DialogContent>
    </DialogOverlay>,
    (window as any)["modal"]
  );
}

export function useDialog(fn: (res: "ok" | "cancel") => void) {
  const [isOpen, setState] = useState(false);
  function open() {
    setState(true);
  }
  function close() {
    setState(false);
  }
  return {
    open,
    close,
    isOpen,
    dialog: isOpen ? <Dialog onClick={fn} /> : null
  };
}
