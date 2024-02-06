import React, { Component } from "react";
import { app, pages } from "@microsoft/teams-js";

class TabConfig extends Component {
  componentDidMount() {
    const initializeApp = async () => {
      try {
        await app.initialize();

        pages.config.registerOnSaveHandler((saveEvent) => {
          const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
          pages.config
            .setConfig({
              suggestedDisplayName: "My Tab",
              entityId: "Test",
              contentUrl: baseUrl + "/index.html#/tab",
              websiteUrl: baseUrl + "/index.html#/tab",
            })
            .then(() => {
              saveEvent.notifySuccess();
            });
        });

        pages.config.setValidityState(true);

        app.notifySuccess();
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }

  render() {
    return (
      <div>
        <h1>Tab Configuration</h1>
        <div>
          This is where you will add your tab configuration options the user can
          choose when the tab is added to your team/group chat.
        </div>
      </div>
    );
  }
}

export default TabConfig;
