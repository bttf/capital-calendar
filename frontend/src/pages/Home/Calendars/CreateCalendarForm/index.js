import React from 'react';
import styled from 'styled-components';

const CreateCalendarFormContainer = styled('div')`
  width: 360px;

  border-radius: 8px;

  padding: 16px;
  box-shadow: inset 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

export default class CreateCalendarForm extends React.Component {
  render() {
    return <CreateCalendarFormContainer />;
  }
}
