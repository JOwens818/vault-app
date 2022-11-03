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
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);


  const invalidUserInputLength = (field, size) => {
    return field.length < size;
  }


  const validateUserInputs = (payload) => {
    const areAllInputsValid = true;

    if (invalidUserInputLength(payload.username, 6)) {
      setInvalidUsername(true);
      areAllInputsValid = false;
    }

    if (invalidUserInputLength(payload.password, 10)) {
      setInvalidPassword(true);
      areAllInputsValid = false;
    }

    if (newUser && invalidUserInputLength(payload.email, 6)) {
      setInvalidEmail(true);
      areAllInputsValid = false;
    }

    return areAllInputsValid;
  }


  const login = async (e) => {

    setInvalidUsername(false);
    setInvalidPassword(false);
    setInvalidEmail(false);
    setLoginLoading(true);
    setBadLogin(false);

    const payload = {
      username: username.value,
      password: password.value,
    }

    if (newUser) { 
      payload.email = email.value 
    }

    if (username.value !== "admin" && !validateUserInputs(payload)) { 
      setLoginLoading(false);
      return; 
    }

    await sendLoginRequest(payload);
  }


  const sendLoginRequest = async (payload) => {
    const apiRoute = newUser ? "/api/auth/signup" : "/api/auth/login";
    const headers = {
      "Content-type": "application/json"
    };

    const loginResp = await fetcher("login", apiRoute, "POST", headers, JSON.stringify(payload));
    if (loginResp.status !== "success") {
      setNotificationText(loginResp.message);
      if (loginResp.status === "fail") {
        if (loginResp.message === "Invalid email address format") {
          setInvalidEmail(true);
        }
        setNotificationType("info");
      } else {
        setNotificationType("error");
      }
      setBadLogin(true);
      setLoginLoading(false);
    } else {
      const redirect = payload.username === "admin" ? "/admin" : "/";
      router.push(redirect);
    }
  }


  if (authLoading) return <Loading />;

  return (
    <Theme theme={theme} className="windowHeight">
      <FlexGrid fullWidth={true}>
        <Row>
          <Column 
            xlg={{ span: 8, offset: 4 }}
            lg={{ span: 10, offset: 3 }}
            md={{ span: 6, offset: 1 }}
            sm={4}
          >
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
                    labelText="Enter Username"
                    placeholder="user123"
                    invalid={invalidUsername}
                    invalidText="Username must be at least 6 characters"
                  />
                  { newUser && 
                    <TextInput 
                      id="email"
                      name="email"
                      type="text"
                      labelText="Enter Email Address"
                      placeholder="user123@gmail.com"
                      invalid={invalidEmail}
                      invalidText="Enter a valid email address"
                    />
                  }
                  
                  <TextInput.PasswordInput 
                    id="password"
                    name="password"
                    type="password"
                    labelText="Enter Password"
                    placeholder="p@ssw0rd"
                    invalid={invalidPassword}
                    invalidText="Password must be at least 10 characters"
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