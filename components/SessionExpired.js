import { Tile } from "@carbon/react";
import { InformationFilled } from '@carbon/react/icons';
import Link from "next/link";

const SessionExpired = () => {
  return (
    <Tile className="regularLink">
      <div className="inlineNotiContainer">
        <InformationFilled size={20} className="infoIcon"/>
        <div className="notiText">Session Expired... <Link href="/login">Click here to login!</Link></div>
      </div>
    </Tile>
  );
};

export default SessionExpired;