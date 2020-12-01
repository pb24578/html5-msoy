import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import routes from '../../shared/routes';
import { getUser } from '../../shared/user/selectors';
import { FlexRow, FlexColumn } from '../../shared/styles/flex';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 100%;
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

export const Profile = React.memo(() => {
  const { displayName } = useSelector(getUser);

  return (
    <Container>
      <DisplayName>{displayName}</DisplayName>
      <FlexRow>
        <ProfileLink to={routes.index.path}>Visit Home</ProfileLink>
      </FlexRow>
    </Container>
  );
});
