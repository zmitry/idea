import * as React from "react";
import { Icon } from "./Icon";
import { useAsync, useAsyncCall } from "../useAsync";
import { getUserData, logout } from "../api";
import { Redirect } from "wouter";
import LoaderIcon from "../assets/loader.gif";
import styled from "@emotion/styled";

const Avatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .logout {
    color: var(--secondary);
    margin-top: 10px;
  }
  .logout:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  & > img {
    border-radius: 50%;
  }
  & > .username {
    color: white;
    font-size: var(--fontSize4);
    margin-top: 5px;
  }
`;
export function UserAvatar() {
  const { value, loading, error } = useAsync(getUserData);
  const logoutAsync = useAsyncCall(logout);
  if (logoutAsync.value) {
    return <Redirect to="/login" />;
  }

  if (loading || logoutAsync.loading) {
    return (
      <Avatar>
        <Icon style={{ margin: "auto" }} icon={LoaderIcon} size={64} />
      </Avatar>
    );
  }
  if (error) {
    return <>Error</>;
  }
  const { avatar_url, name } = value!;
  return (
    <Avatar>
      <Icon size={64} icon={avatar_url} />
      <span className="username">{name}</span>
      <span className="logout" onClick={logoutAsync.call}>
        Log out
      </span>
    </Avatar>
  );
}
