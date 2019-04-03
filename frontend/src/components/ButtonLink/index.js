import React from 'react';
import styled from 'styled-components';

const ButtonLink = styled('button')`
  display: inline-block;
  color: #697796;
  font-size: inherit;
  font-weight: 600;
  text-decoration: none;
  border: 0;
  padding: 0;
  margin: 0;
  outline: 0;
  cursor: pointer;
  white-space: normal;
`;

export default ({ onClick, children }) => <ButtonLink onClick={onClick}>{children}</ButtonLink>;
