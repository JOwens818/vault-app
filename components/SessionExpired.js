import { Tile } from "@carbon/react";
import InlineNoti from "./InlineNoti";
import { InformationFilled } from '@carbon/react/icons';


const SessionExpired = () => {
  return (
    <Tile className="regularLink">
      <div className="inlineNotiContainer">
        <InformationFilled size={20} className="infoIcon"/>
        <div className="notiText">Session Expired... <a href="/login">Click here to login!</a></div>
      </div>
    </Tile>
  );
};

export default SessionExpired;