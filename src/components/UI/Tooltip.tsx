import React, { ReactNode } from "react";
import styled from "styled-components";

export const Tooltip = ({ children }: { children: ReactNode }) => {
  return <TooltipContainer>{children}</TooltipContainer>;
};

const TooltipContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px 24px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
