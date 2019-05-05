import React from 'react';
import styled from 'styled-components';

export const ItemCardContainer = styled('div')`
  height: 70px;
  width: 360px;

  margin-bottom: 16px;

  background: ${p => (p.background ? p.background : 'white')};

  ${p => !p.isDashedBorder && 'box-shadow:  0px 1px 4px 0 rgba(0, 0, 0, 0.25);'} ${p =>
    p.isClickable &&
    `
    cursor: pointer;

    &:hover {
      box-shadow:  0px 2px 10px 0 rgba(0, 0, 0, 0.25);
      transform: scale(1.05);
    }
  `}

  border-radius: 8px;

  ${p => (p.isDashedBorder ? 'border: 3px dashed #697796;' : '')} display: flex;
  align-items: center;
  justify-content: center;

  ${p =>
    p.isInTheEther
      ? `
    opacity: 0;
    transform: scale(1.1);
    box-shadow:  0px 2px 10px 0 rgba(0, 0, 0, 0.25);
  `
      : `
    ${p.isFaded ? 'opacity: 0.3' : 'opacity: 1;'}
    transform: scale(1);
  `} ${p =>
    p.borderLeft
      ? `
    border-left: 4px solid ${p.borderLeft};
  `
      : ''}

  transition: all 500ms;
`;

export default class ItemCard extends React.Component {
  state = { isInTheEther: true };

  componentDidMount() {
    const { index = 0 } = this.props;

    setTimeout(() => {
      this.setState({ isInTheEther: false });
    }, 100 * (index + 1));
  }

  render() {
    const { background, borderLeft, isDashedBorder, isClickable, isFaded, children } = this.props;
    const { isInTheEther } = this.state;

    return (
      <ItemCardContainer
        isFaded={isFaded}
        isClickable={isClickable}
        isInTheEther={isInTheEther}
        borderLeft={borderLeft}
        background={background}
        isDashedBorder={isDashedBorder}
      >
        {children}
      </ItemCardContainer>
    );
  }
}
