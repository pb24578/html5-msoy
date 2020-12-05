import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import routes from '../../shared/routes';
import { FlexRow, FlexColumn } from '../../shared/styles/flex';
import { getProfile, getProfileError } from './selectors';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 80vh;
  background-color: ${(props) => props.theme.colors.secondary};
`;

const DisplayName = styled.div`
  color: ${(props) => props.theme.colors.quaternary};
  font-size: 24px;
`;

const ProfileLink = styled(Link)`
  margin-right: 4px;
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
`;

const Loading = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
`;

const Error = styled.div`
  color: ${(props) => props.theme.errorColors.secondary};
  font-weight: bold;
`;

export const Profile = React.memo(() => {
  const profile = useSelector(getProfile);
  const profileError: Error = useSelector(getProfileError);
  if (!profile) {
    if (profileError) {
      return (
        <Container>
          <Error>{profileError.message}</Error>
        </Container>
      );
    }
    return <Container />;
  }
  const { displayName, redirectRoomId } = profile;

  return (
    <Container>
      <DisplayName>{displayName}</DisplayName>
      <FlexRow>
        <ProfileLink to={`${routes.rooms.pathname}/${redirectRoomId}`}>Visit Home</ProfileLink>
      </FlexRow>
    </Container>
  );
});
