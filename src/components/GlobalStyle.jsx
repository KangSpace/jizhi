import { createGlobalStyle } from 'styled-components';
import JXZhuoKai from '../fonts/JXZhuoKai.woff';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'JXZhuoKai';
    src: url(${JXZhuoKai}) format('woff');
  }

  html,
  body {
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-family: 'JXZhuoKai';
    height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
  pre {
      background: #eee;
      padding: 1rem;
      overflow: auto;
      border-radius: 3px;
      max-width: 80ch;
    }
    
    pre code {
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;
    }
`;

export default GlobalStyle;
