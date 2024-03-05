import React from "react";
import { app, teamsCore } from "@microsoft/teams-js";
import "./App.css";
import Annuities from "./Anuuities";
// import IframComp from "./IframComp";
class Tab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      context: {
        meetingId: "",
        userName: "",
        meetingTitle: "",
        chatId: "",
      },
    };
  }

  componentDidMount() {
    app.initialize().then(() => {
      app.notifySuccess();
      app.getContext().then(async (context) => {
        this.setState({
          // meetingId: context.meeting.id,
          userName: context.user.userPrincipalName,
          meetingTitle: context.meeting.meetingTitle,
          chatId: context.chat.id,
        });
        console.log("context meeting", context);

        if (context.page.frameContext === "sidePanel") {
          teamsCore.registerOnLoadHandler((context) => {
            app.notifySuccess();
          });
          teamsCore.registerBeforeUnloadHandler((readyToUnload) => {
            readyToUnload();
            return true;
          });
        }
      });
    });
  }
  render() {
    // let meetingId = this.state.meetingId ?? "";
    let chatId = this.state.chatId ?? "";

    return (
      <div padding-left="0px">
        {/* <p>{meetingId}</p> */}
        {/* <p>{chatId}</p> */}
        {/* {<MeetingSummary chatid={chatId} />} */}
        {/* <Dynamics365Entity/> */}
        {/* <InstructionProject chatid={chatId} /> */}
        <Annuities chatid={chatId} />
        {/* <AnnuitiesClientInstructions chatid={chatId} /> */}
        {/* <AnuuitiesProjectId chatid={chatId}/> */}
        {/* <ProjectInstruction chatid={chatId} /> */}
        {/* <IframComp /> */}
        {/* <AddAnnuitty chatid={chatId} /> */}
      </div>
    );
  }
}

export default Tab;
