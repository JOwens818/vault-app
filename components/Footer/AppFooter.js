import React from 'react';
import styles from './AppFooter.module.scss';
import { Row, Column } from '@carbon/react';

const AppFooter = () => {

  return (
    <Row className={styles.footerHeight}>
      <Column className={styles.footerCol}>
        Footer Content Here
      </Column>
    </Row>
  );
};

export default AppFooter;