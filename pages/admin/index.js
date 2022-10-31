import React, { useState } from 'react';
import { useThemePreference } from 'components/ThemePreference';
import { userAuth } from 'components/Auth'; 
import { fetcher } from "lib/apiFetcher";
import { 
  Tile,
  FlexGrid,
  Row,
  Column,
  Theme,
  Loading
 } from '@carbon/react';

 const AdminPage = () => {

  const { theme } = useThemePreference();
  const { username, authLoading } = userAuth();

  if (authLoading || username !== "admin") return <Loading />;

  return (
    <Theme theme={theme} className="windowHeight">
      <FlexGrid fullWidth={true}>
        {
          username && !authLoading && (
            <>
            <Row>
              <Column>
                <Tile>
                  {username}
                </Tile>
              </Column>
            </Row>
            </>
          )
        }
      </FlexGrid>
    </Theme>
  );
 };

 export default AdminPage;