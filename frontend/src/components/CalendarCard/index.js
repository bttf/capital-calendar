import React from 'react';
import styled from 'styled-components';
import ItemCard from '../ItemCard';

const CalendarName = styled('div')`
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: #000;
`;

export default props => {
  const { calendar } = props;

  return (
    <ItemCard>
      <CalendarName>{calendar.name}</CalendarName>
    </ItemCard>
  );
};
