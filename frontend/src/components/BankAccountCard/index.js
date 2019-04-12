import React from 'react';
import styled from 'styled-components';
import ItemCard from '../ItemCard';

const ItemCardInner = styled('div')`
  flex: 1;
  display: flex;

  img {
    max-height: 24px;
    width: auto;
  }
`;

const ItemCardDetails = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AccountName = styled('div')`
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #f4f4f4;
`;

export default ({ logo, primaryColor, name }) => {
  return (
    <ItemCard background={`linear-gradient(360deg, ${primaryColor} 0%, #FFFFFF 100%)`}>
      <ItemCardInner>
        <img src={`data:image/png;base64,${logo}`} alt="Logo" />
        <ItemCardDetails>
          <AccountName>{name}</AccountName>
        </ItemCardDetails>
      </ItemCardInner>
    </ItemCard>
  );
};
