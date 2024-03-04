import React from "react";
import { app, teamsCore } from "@microsoft/teams-js";
import "./App.css";
import ProjectInstruction from "./ProjectInstruction";
import AnuuitiesProjectId from "./AnuuitiesProjectId";
import AnnuitiesClientInstructions from "./AnnuitiesClientInstructions";
import Annuities from "./Anuuities";

class Tabs extends React.Component {
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
        <ProjectInstruction chatid={chatId}/>
        <AnuuitiesProjectId chatid={chatId}/>
        {/* <AnnuitiesClientInstructions chatid={chatId}/> */}


      </div>
    );
  }
}

export default Tabs;
