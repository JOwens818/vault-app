import { InlineNotification } from "@carbon/react";

import {
  InformationFilled,
  ErrorFilled,
  CheckmarkFilled
} from '@carbon/react/icons';

const InlineNoti = (props) => {

  if (props.data.status === "success") {
    return (
      <div className="inlineNotiContainer">
        <CheckmarkFilled size={20} className="checkmarkIcon"/>
        <div className="notiText">{props.data.message}</div>
      </div>
    );
  }

  if (props.data.status === "fail") {
    return (
      <div className="inlineNotiContainer">
        <InformationFilled size={20} className="infoIcon"/>
        <div className="notiText">{props.data.message}</div>
      </div>
    );
  }


    return (
      <div className="inlineNotiContainer">
        <ErrorFilled size={20} className="errorIcon"/>
        <div className="notiText">{props.data.message}</div>
      </div>
    );

};

export default InlineNoti;