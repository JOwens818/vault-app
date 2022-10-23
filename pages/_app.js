import React from 'react';
import AppHeader from 'components/Header/AppHeader';
import AppFooter from 'components/Footer/AppFooter';
import { Content, Theme } from '@carbon/react';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Theme theme="g100">
        <AppHeader />
      </Theme>
      
      <Content>
        <Component {...pageProps} />
      </Content>

      <Theme theme="g100">
        <AppFooter />
      </Theme>
    </>
  );
}

export default MyApp;
