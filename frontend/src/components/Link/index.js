import React from 'react';
import styled from 'styled-components';

const Link = styled('a')`
  color: #697796;
  font-weight: 600;
  text-decoration: none;
`;

export default ({ href, children }) => <Link href={href}>{children}</Link>;
