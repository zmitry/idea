import React, { useState } from "react";
import AddIcon from "../assets/add.png";
import BulbIcon from "../assets/bulb.png";
import LoaderIcon from "../assets/loader.gif";

import styled from "@emotion/styled";
import { Icon } from "../ui/Icon";
import { useAsync } from "../useAsync";
import { getIdeas, Idea } from "../api";
import { Item } from "./Item";

const Table = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 6fr) repeat(4, minmax(70px, 100px)) minmax(
      80px,
      1fr
    );
  grid-auto-flow: row;
  grid-template-rows: 50px repeat(auto-fit, 40px);
  overflow-y: auto;
  place-items: center center;
`;

const PageWrapper = styled.div`
  margin: 0px 60px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  grid-area: 1/2;
  display: grid;
  grid-template-rows: 150px 1fr;

  & > .heading {
    font-size: var(--fontSize2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  .divider {
    position: absolute;
    width: 108%;
    left: -4%;
    top: 120px;
  }

  .empty {
    grid-area: 1/1 / z/z;
    .empty-content {
      text-align: center;
      font-size: var(--fontSize4);
    }
  }
`;

export const Divider = styled.div`
  border: 0.7px solid var(--secondary);
  width: 100%;
  opacity: 0.2;
`;

function IdeasTemplate({
  children,
  onAdd,
  empty
}: {
  children: React.ReactNode;
  onAdd: () => void;
  empty: boolean;
}) {
  const Header = (
    <React.Fragment>
      <span />
      <span>Impact</span>
      <span>Ease</span>
      <span>Confidence</span>
      <span>
        <b>Avg.</b>
      </span>
      <span />
    </React.Fragment>
  );
  return (
    <PageWrapper>
      <div className="heading">
        My Ideas <Icon onClick={onAdd} icon={AddIcon} size={50} />
      </div>
      <Divider className="divider" />
      <Table>
        {empty ? (
          <div className="empty">
            <Icon size={96} icon={BulbIcon} />
            <p className="empty-content">Got Ideas?</p>
          </div>
        ) : (
          <>
            {Header}
            {children}
          </>
        )}
      </Table>
    </PageWrapper>
  );
}
export function Ideas() {
  const [newIdea, setNewIdea] = useState(null as Partial<Idea> | null);
  const { value = [] as Idea[], setData, loading } = useAsync(getIdeas);
  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <Icon size={60} style={{ margin: "auto" }} icon={LoaderIcon} />
      </div>
    );
  }
  return (
    <IdeasTemplate
      empty={value.length === 0 && !newIdea}
      onAdd={() =>
        setNewIdea({
          ease: 10,
          impact: 10,
          confidence: 10
        })
      }
    >
      {newIdea && (
        <Item
          isCreate={true}
          values={newIdea}
          onSave={values => {
            setNewIdea(null);
            setData(ideas => [values as any, ...ideas]);
          }}
          onRemove={() => {
            setNewIdea(null);
          }}
        />
      )}
      {value.map(data => (
        <Item
          key={data.id}
          values={data}
          onSave={values => {
            setData(value =>
              value.map(el => {
                if (el.id === values.id) {
                  return values as any;
                }
                return el;
              })
            );
          }}
          onRemove={() => {
            setData(value => value.filter(el => el.id !== data.id));
          }}
        />
      ))}
    </IdeasTemplate>
  );
}
