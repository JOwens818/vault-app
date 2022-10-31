import React from 'react';
import { Row, Column, Theme } from '@carbon/react';

const AppFooter = () => {

  return (
    <Theme theme='g100'>
      <Row className="footerContainer">
        <Column>
          Footer Content Here
        </Column>
      </Row>
    </Theme>
  );
};

export default AppFooter;