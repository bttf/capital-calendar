import React from 'react';
import styled from 'styled-components';

const ItemCardContainer = styled('div')`
  height: 100px;
  width: 360px;

  background: ${p =>
    p.background ? p.background : 'linear-gradient(360deg, #F4F4F4 0%, #FFFFFF 100%)'};

  ${p =>
    p.isDashedBorder ? '' : 'box-shadow:  0px 1px 4px rgba(0, 0, 0, 0.25);'} border-radius: 16px;

  ${p => (p.isDashedBorder ? 'border: 3px dashed #697796;' : '')} display: flex;
  align-items: center;
  justify-content: center;
`;

export default ({ background, isDashedBorder, children }) => {
  return (
    <ItemCardContainer background={background} isDashedBorder={isDashedBorder}>
      {children}
    </ItemCardContainer>
  );
};
