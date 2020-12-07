import 'styled-components';
import { MainTheme } from '../shared/styles/theme';

declare module 'styled-components' {
  type Theme = typeof MainTheme;
  export interface DefaultTheme extends Theme {}
}
