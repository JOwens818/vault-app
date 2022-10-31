import styles from '../styles/Home.module.scss'
import { userAuth } from 'components/Auth'; 
import { useThemePreference } from 'components/ThemePreference';
import { 
  Tile,
  FlexGrid,
  Row,
  Column,
  Theme,
  Loading
 } from '@carbon/react';


const LandingPage = () => {

  const { username, authLoading } = userAuth();
  const { theme } = useThemePreference();

  if (!username || username === "admin" || authLoading) return <Loading />;

  return (
    <Theme theme={theme} className="windowHeight">
      <FlexGrid fullWidth={true}>
        {
          username && !authLoading && (
            <>
              <Row>
                <Column>
                  <Tile>
                  </Tile>
                </Column>
                <Column>
                  <Tile>
                    {username}
                  </Tile>     
                </Column>
              </Row>
              <Row>
                <Column>
                  <Tile>
                    Nam ac tellus turpis. Curabitur lobortis lectus in ligula condimentum varius convallis 
                    non diam. Sed pharetra nibh erat, viverra tempor magna tincidunt euismod. Curabitur 
                    eget risus sit amet tellus tempor tristique. Fusce iaculis massa elit, porttitor eleifend 
                    lacus auctor eget. Integer sodales luctus turpis, vel dignissim elit. Aenean consequat 
                    suscipit dolor non blandit. Ut mattis tempus eros, sit amet volutpat velit tristique a.
                  </Tile>   
                </Column>
                <Column>
                  <Tile>
                    Nam ac tellus turpis. Curabitur lobortis lectus in ligula condimentum varius convallis 
                    non diam. Sed pharetra nibh erat, viverra tempor magna tincidunt euismod. Curabitur 
                    eget risus sit amet tellus tempor tristique. Fusce iaculis massa elit, porttitor eleifend 
                    lacus auctor eget. Integer sodales luctus turpis, vel dignissim elit. Aenean consequat 
                    suscipit dolor non blandit. Ut mattis tempus eros, sit amet volutpat velit tristique a.
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

export default LandingPage;