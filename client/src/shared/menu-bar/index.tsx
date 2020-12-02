import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { replace } from 'connected-react-router';
import { Close } from '@styled-icons/material';
import routes from '../routes';
import { FlexRow } from '../styles/flex';
import { getRoomId } from '../../components/game/selectors';

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
  const dispatch = useDispatch();
  const roomId = useSelector(getRoomId);

  /**
   * When closing the menu bar, go to the room that the user is in right now.
   */
  const onClickClose = () => {
    dispatch(replace(`${routes.rooms.pathname}/${roomId}`));
  };

  return <Container>{roomId && <CloseIcon onClick={onClickClose} />}</Container>;
});
