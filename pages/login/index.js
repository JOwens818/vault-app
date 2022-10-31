import React, { useState } from 'react';
import { useRouter } from "next/router";
import { useThemePreference } from 'components/ThemePreference';
import { userAuth } from 'components/Auth'; 
import { fetcher } from "lib/apiFetcher";
import { 
  Tile,
  FlexGrid,
  Row,
  Column,
  Theme,
  FormGroup,
  Stack,
  TextInput,
  Checkbox,
  Button,
  Loading,
  InlineLoading,
  InlineNotification
 } from '@carbon/react';

 const LoginPage = () => {

  const router = useRouter();
  const { theme } = useThemePreference();
  const { authLoading } = userAuth();
  const [newUser, setNewUser] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [badLogin, setBadLogin] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationText, setNotificationText] = useState("");

  const login = async (e) => {
    setLoginLoading(true);
    setBadLogin(false);
    const payload = {
      username: username.value,
      password: password.value
    }
    
    const headers = {
      "Content-type": "application/json"
    };

    const loginResp = await fetcher("login", "/api/auth/login", "POST", headers, JSON.stringify(payload));
    if (loginResp.status !== "success") {
      setNotificationText(loginResp.message);
      if (loginResp.status === "fail") {
        setNotificationType("info");
      } else {
        setNotificationType("error");
      }
      setBadLogin(true);
      setLoginLoading(false);
    } else {
      const redirect = username.value === "admin" ? "/admin" : "/";
      router.push(redirect);
    }
  }


  if (authLoading) return <Loading />;

  return (
    <Theme theme={theme} className="windowHeight">
      <FlexGrid fullWidth={true}>
        <Row>
          <Column>
            <Tile>
              <FormGroup legendText="Login or Sign up">
                <Stack gap={7}>
                  <Checkbox 
                    id="newuser"
                    labelText="I'm a new user"
                    checked={newUser}
                    onChange={() => setNewUser(!newUser)}
                  />
                  <TextInput 
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter Username"
                    hideLabel
                  />
                  <TextInput.PasswordInput 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    hideLabel
                  />
                  {
                    !loginLoading ? (
                      <Button 
                        id="submit"
                        onClick={login}
                      >
                        { newUser ? "Sign Up" : "Login" }
                      </Button>
                    ) : (
                      <InlineLoading 
                        description="Logging in..."
                        status="active"
                      />
                    )
                  }
                  
                </Stack>
              </FormGroup>
              {
                badLogin &&
                <InlineNotification
                className="inlineNotification"
                  kind={notificationType}
                  subtitle={notificationText}
                />
              }
            </Tile>
          </Column>
        </Row>
      </FlexGrid>
    </Theme>
  );
 };

 export default LoginPage;