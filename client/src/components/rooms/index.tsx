import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FlexColumn } from '../../shared/styles/flex';
import { getRooms } from './selectors';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 80vh;
  background-color: ${(props) => props.theme.colors.secondary};
`;

const RoomTitle = styled.div`
  color: ${(props) => props.theme.colors.quarternary};
  font-size: 24px;
`;

export const Rooms = React.memo(() => {
  const rooms = useSelector(getRooms);
  return (
    <Container>
      <RoomTitle>Active Rooms</RoomTitle>
    </Container>
  );
});
