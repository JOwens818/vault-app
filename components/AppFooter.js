import React from 'react';
import { Row, Column, Theme } from '@carbon/react';
import { useThemePreference } from 'components/ThemePreference';

const AppFooter = () => {

  const { theme } = useThemePreference();

  return (
    <Theme theme={theme}>
      <Row className="footerContainer">
        <Column>
          Footer Content Here
        </Column>
      </Row>
    </Theme>
  );
};

export default AppFooter;