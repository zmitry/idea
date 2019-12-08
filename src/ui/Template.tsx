// @jsx jsx
import { jsx } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";
import Logo from "../assets/IdeaPoolLogo.png";

const TemplateInternal = styled.div`
  display: grid;
  grid-template-columns: 200px 4fr;
  position: relative;
  .sidebar {
    display: flex;
    flex-direction: column;
    background: var(--primary);
  }
  .sidebar-divider {
    width: 80%;
    height: 0px;
    border: 1px solid white;
    opacity: 0.2;
    margin-top: 27px;
    margin-bottom: 27px;
    margin-left: auto;
    margin-right: auto;
  }
`;

function SidebarLogo() {
  return (
    <div
      css={{
        paddingTop: 37,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <img
        css={{
          margin: "auto"
        }}
        src={Logo}
        alt="logo url"
        width={64}
        height={64}
      />
      <span
        css={{
          fontSize: "var(--fontSize5)",
          color: "white",
          marginTop: 13
        }}
      >
        Idea Pool
      </span>
    </div>
  );
}

export function Template({
  children,
  sidebar
}: {
  children: React.ReactNode;
  sidebar?: React.ReactChild;
}) {
  console.log("sidebar: ", sidebar);
  return (
    <TemplateInternal>
      <div className="sidebar">
        <SidebarLogo />
        {sidebar && <div className="sidebar-divider" />}
        {sidebar}
      </div>
      {children}
    </TemplateInternal>
  );
}
