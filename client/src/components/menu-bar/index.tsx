import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { replace } from 'connected-react-router';
import { Close } from '@styled-icons/material';
import routes from '../../shared/routes';
import { FlexRow } from '../../shared/styles/flex';
import { closeMenu } from './actions';

const Container = styled(FlexRow)`
  align-items: center;
  justify-content: flex-end;
  padding: 8px;
  height: 8px;
  background-color: ${(props) => props.theme.darkerColors.primary};
`;

const CloseIcon = styled(Close)`
  width: 18px;
  height: 18px;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.secondary};
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;

export const MenuBar = React.memo(() => {
  /**
   * When closing the menu bar, go to the world that the user is in right now.
   */
  const onClickClose = () => {
    closeMenu();
  };

  return (
    <Container>
      <CloseIcon onClick={onClickClose} />
    </Container>
  );
});
