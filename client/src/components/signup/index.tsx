import React from 'react';
import styled from 'styled-components';
import { FlexColumn } from '../../shared/styles/flex';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 100%;
  background-color: red;
`;

export const Signup = React.memo(() => <Container>Sign-up for HTML5 Whirled!</Container>);
