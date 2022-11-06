import { InlineNotification } from "@carbon/react";

const InlineNoti = (props) => {


  if (props.data.status === "success") return null;

  return (
    <InlineNotification
      className="inlineNotification"
      kind={props.data.status === "fail" ? "info" : "error"}
      subtitle={props.data.message}
    />
  );

};

export default InlineNoti;