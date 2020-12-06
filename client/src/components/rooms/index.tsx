import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import styled from 'styled-components';
import routes from '../../shared/routes';
import { FlexColumn, FlexCenter, FlexRow } from '../../shared/styles/flex';
import { chunkArray } from '../../shared/utils';
import { Room } from './types';
import { getRooms } from './selectors';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 80vh;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.secondary};
`;

const RoomDisplayTitle = styled.div`
  color: ${(props) => props.theme.colors.quarternary};
  font-size: 24px;
`;

const RoomDisplayContainer = styled(FlexColumn)`
  padding: 8px;
`;

const RoomDisplayRow = styled(FlexRow)`
  margin-bottom: 8px;
`;

const RoomDisplay = styled(FlexColumn)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const RoomImage = styled.img`
  width: 128px;
  height: 128px;
  cursor: pointer;
`;

const RoomText = styled.div`
  color: ${(props) => props.theme.colors.quarternary};
  font-size: 16px;
  margin: 2px 0px;
`;

const RoomOwner = styled(RoomText)`
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;

interface RoomComponentProps {
  room: Room;
}

const RoomComponent = (props: RoomComponentProps) => {
  const { room } = props;
  const dispatch = useDispatch();
  const goToRoom = () => dispatch(replace(`${routes.worlds.pathname}/${room.id}`));
  const goToOwnerProfile = () => dispatch(replace(`${routes.profiles.pathname}/${room.owner.id}`));
  return (
    <RoomDisplay>
      <RoomImage
        onClick={goToRoom}
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Solid_black.svg/240px-Solid_black.svg.png"
      />
      <RoomText>{room.name}</RoomText>
      <FlexCenter>
        <RoomText>Owner:&nbsp;</RoomText>
        <RoomOwner onClick={goToOwnerProfile}>{room.owner.displayName}</RoomOwner>
      </FlexCenter>
      <RoomText>
        {room.online} {room.online === 1 ? 'Person' : 'People'} Online!
      </RoomText>
    </RoomDisplay>
  );
};

export const Rooms = React.memo(() => {
  const rooms = useSelector(getRooms);
  if (!rooms) return <Container />;
  const roomsPerRow = 3;
  const roomsPerPage = 6;

  /**
   * Determine the current page to showcase for the active rooms.
   */
  const currentActivePage = 0;
  const activePage = chunkArray(rooms.active, roomsPerPage)[currentActivePage];
  const activeRows = chunkArray(activePage, roomsPerRow);

  /**
   * Determine the current page to showcase for the newest rooms.
   */
  const currentNewPage = 0;
  const newPage = chunkArray(rooms.new, roomsPerPage)[currentNewPage];
  const newRows = chunkArray(newPage, roomsPerRow);

  return (
    <Container>
      <RoomDisplayTitle>Active Rooms</RoomDisplayTitle>
      <RoomDisplayContainer>
        {activeRows.map((activeRow, index) => {
          const roomRow = activeRow.map((room) => <RoomComponent key={room.id} room={room} />);
          return <RoomDisplayRow key={index}>{roomRow}</RoomDisplayRow>;
        })}
      </RoomDisplayContainer>
      <RoomDisplayTitle>New Rooms</RoomDisplayTitle>
      <RoomDisplayContainer>
        {newRows.map((newRow, index) => {
          const roomRow = newRow.map((room) => <RoomComponent key={room.id} room={room} />);
          return <RoomDisplayRow key={index}>{roomRow}</RoomDisplayRow>;
        })}
      </RoomDisplayContainer>
    </Container>
  );
});
