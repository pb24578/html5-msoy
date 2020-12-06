import React from 'react';
import styled from 'styled-components';
import { FlexColumn } from '../../shared/styles/flex';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 82.5vh;
  background-color: ${(props) => props.theme.colors.secondary};
`;

export const About = React.memo(() => (
  <Container>
    <h3>Thanks to these people for contributing :)</h3>
    <p>Haze (Project Manager)</p>
    <p>aaaa (Artist)</p>
    <p>Zahreik (Artist)</p>
    <p>Cactus (Server Provider)</p>
    <p>Snah (Unofficially Shadowsych&apos;s Test Dummy)</p>
    <p>608 (Unofficially Shadowsych&apos;s Bug Hunter)</p>
  </Container>
));
