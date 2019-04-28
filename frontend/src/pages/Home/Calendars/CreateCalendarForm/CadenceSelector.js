import React from 'react';
import styled from 'styled-components';

const CadenceSelectorContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 8px 16px;

  border-radius: 4px;
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);

  margin-bottom: 16px;
`;

const CadenceOptionText = styled('div')`
  cursor: pointer;
  font-weight: 600;
  color: ${p => (p.isSelected ? '#808080' : '#C4C4C4')};
`;

export default () => {
  return (
    <CadenceSelectorContainer>
      <CadenceOptionText>Daily</CadenceOptionText>
      <CadenceOptionText>Weekly</CadenceOptionText>
      <CadenceOptionText>Monthly</CadenceOptionText>
    </CadenceSelectorContainer>
  );
};
