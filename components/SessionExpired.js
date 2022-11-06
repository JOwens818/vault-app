import { Tile } from "@carbon/react";

const SessionExpired = () => {
  return (
    <Tile className="regularLink">
      <h5>Session Expired... <a href="/login">Click here to login!</a></h5>
    </Tile>
  );
};

export default SessionExpired;