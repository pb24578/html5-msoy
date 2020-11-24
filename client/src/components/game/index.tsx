import React from 'react';
import styled from 'styled-components';
import { FlexCenter } from '../../shared/styles/flex';
import app, { appDOMId } from '../../shared/pixi';

const Container = styled(FlexCenter)`
  padding: 8px;
`;

export const Game = React.memo(() => <Container id={appDOMId} />);
