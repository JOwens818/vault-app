import React, { useState } from 'react';
import styles from '../styles/Home.module.scss'
import { userAuth } from 'components/Auth'; 
import { useThemePreference } from 'components/ThemePreference';
import SecretsList from 'components/SecretsList';
import SecretInput from 'components/SecretInput';
import { 
  Tile,
  FlexGrid,
  Row,
  Column,
  Theme,
  Loading,
  ContentSwitcher,
  Switch
 } from '@carbon/react';


const LandingPage = () => {

  const { username, authLoading } = userAuth();
  const { theme } = useThemePreference();
  const [contentIndex, setContentIndex] = useState(0);

  if (!username || username === "admin" || authLoading) return <Loading />;

  return (
    <Theme theme={theme} className="windowHeight">
      <FlexGrid fullWidth={true}>
        {
          username && !authLoading && (
            <>
              <Row>
                <Column
                  xlg={{ span: 8, offset: 4 }}
                  lg={{ span: 10, offset: 3 }}
                  md={{ span: 6, offset: 1 }}
                  sm={4}
                >
                  
                    <ContentSwitcher
                      className="contentSwitcher" 
                      onChange={(obj) => {
                        let { index } = obj;
                        setContentIndex(index);
                      }}>
                      <Switch name="list" text="Secrets Manager" />
                      <Switch name="create" text="Create Secret" />
                    </ContentSwitcher>
                    {
                      contentIndex === 0 ? (
                        <SecretsList />
                      ) : (
                        <SecretInput />
                      )
                    }
                </Column>
              </Row>
            </>
          )
        }
        
      </FlexGrid>
    </Theme>
  );
};

export default LandingPage;