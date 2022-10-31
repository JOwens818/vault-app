import React from 'react';
import '../styles/globals.scss';
import AppHeader from 'components/AppHeader';
import AppFooter from 'components/AppFooter';
import { ThemePreference } from 'components/ThemePreference';
import { AuthProvider } from 'components/Auth';
import { Content } from '@carbon/react';


function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemePreference>
        <AppHeader />
        <AuthProvider>
          <Content>
            <Component {...pageProps} />
          </Content>
        </AuthProvider>
        <AppFooter />
      </ThemePreference>
    </>
  );
}

export default MyApp;
