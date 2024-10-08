import Title from "./TitleComponent";
import { useState, useEffect, useMemo } from "react";

import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import PointingGame from "../PointingGame";

export default function OnBoarding({ title }) {
  const [name, setName] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [submitClicked, setsubmitClicked] = useState(false)
  const [userId, setuserId] = useState("")

  const httpConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl("http://pointingame.runasp.net/PointingGame")
      .withAutomaticReconnect()
      .build();
  }, []);

  function onPlayerPointed(point) {
    if (httpConnection) httpConnection.invoke("OnPlayerPointed", point, userId);
  }

  useEffect(()=>{
    if(submitClicked)
        setuserId(name+Date.now())
  },[submitClicked])

  useEffect(() => {

    if (httpConnection && userId) 
        {
            async function start() {
                try {

                await httpConnection.start();

                console.log("SignalR Connected.");

                httpConnection.invoke("OnConnection", name, userId);

                setsubmitClicked(false)

                } catch (err) {

                console.log(err);

                setsubmitClicked(false)
                }
            }
 
            setUpListeners()

        if (httpConnection.state == HubConnectionState.Disconnected && submitClicked) start();
    }

    return () => {
      if (httpConnection.state == HubConnectionState.Connected && !submitClicked)
        httpConnection.stop();
    removeListeners()

    };

    function setUpListeners(){

        httpConnection.on("playerJoined", (l) => setPlayersList(l));

        httpConnection.on("playerDisconnected", (l) => setPlayersList(l));   

        httpConnection.on("playerPointed", (l) => setPlayersList(l));

        httpConnection.onreconnected(()=> httpConnection.invoke("OnReconnect", userId))
    }

    function removeListeners(){

        httpConnection.off("playerJoined");

        httpConnection.off("playerDisconnected");   

        httpConnection.off("playerPointed");

        httpConnection.onreconnected(null)
    }

  }, [submitClicked, userId]);

  return (
    <>
      <Title title={title}></Title>
      {httpConnection.state != HubConnectionState.Connected ? (
        <div className="onBoardingParent">
          <div className="onBoardingContainer">
            <h3
              id="nameHeader"
              style={{
                color: "#ffb703",
              }}
            >
              Please enter your name :
            </h3>
            <input
              id="nameInput"
              placeholder="Your name here"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <button
            id="joinSession"
            onClick={() => {
              if (name) {
                setsubmitClicked(true)
              } else console.log("Please enter your name");
            }}
            disabled={name.length == 0}
          >
            Join Session
          </button>
          <button
            id="joinSession"
            onClick={() => {
                setName("Observer")
                setsubmitClicked(true)
            }}
          >
            Join as observer
          </button>
        </div>
      ) : (
        <PointingGame
          playersList={playersList}
          onPlayerPointed={onPlayerPointed}
        ></PointingGame>
      )}
    </>
  );
}
