import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {minutesToDuration,secondsToDuration} from '../utils/duration';

function Pomodoro() {
  // Initial values of focus duration, break duration, timerRunning & session countdown
  const initialStates = {
    focusDuration: 25,
    breakDuration: 5,
    isTimerRunning: false,
    sessionCountdown: 0,
    focusSessionActive: false,
    sessionActive: false,
    ariaValue: 0,
  }
  // Initialize state for focus bar
  const [ariaValue, setAriaValue] = useState(initialStates.ariaValue);

  // Initialize timer state and set to zero so timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(initialStates.isTimerRunning);

  // Initialize focus state and set default to 25 minutes
  const [focusDuration, setFocusDuration] = useState(initialStates.focusDuration);

  // Initialize break state and set default to 5 minutes
  const [breakDuration, setBreakDuration] = useState(initialStates.breakDuration);

  // Initialize state to update session timer
  const [sessionCountdown, setSessionCountdown] = useState(initialStates.sessionCountdown);

  // Initialize state to track when focus and break sessions are active
  const [focusSessionActive, setFocusSessionActive] = useState(initialStates.focusSessionActive);

  //Initialize state for when session it active
  const [sessionActive, setSessionActive] = useState(initialStates.sessionActive);

  // Handle increment button clicks
  const handleIncrementClick = ({target}) => {
    
    /*
    ISSUE: The icons on the buttons and the buttons themselves return different values,
    so I only place handle event on buttons themselves.
    */

    // Handling decrease and increase buttons for focus duration and break duration when not in session
    if (!focusSessionActive && sessionCountdown === 0) {
      switch (target["name"]) {
      case "decrease-focus":
        setFocusDuration((currentFocusDuration) => Math.max(5, (currentFocusDuration - 5)));
        break;
      case "increase-focus":
        setFocusDuration((currentFocusDuration) => Math.min(60,(currentFocusDuration + 5)));
        break;
      case "decrease-break":
        setBreakDuration((currentBreakDuration) => Math.max(1, (currentBreakDuration - 1)));
        break;
      case "increase-break":
        setBreakDuration((currentBreakDuration) => Math.min(15, (currentBreakDuration + 1)));
        break;
      default:
        break;
      }
    }
  }

  useInterval(
    () => {
      // Completed: Implement what should happen when the timer is running
      
      // Functionality for the progress bar
      if (focusSessionActive) {
        setAriaValue((sessionCountdown/(focusDuration * 60) * 100));
      } else if (!focusSessionActive & sessionCountdown !== 0) {
        setAriaValue((sessionCountdown/(breakDuration * 60) * 100));
      }

      /*
      If session is active and countdown equals focus duration, set focus session to false and start counting break duration.
      Is focus session is false and countdown equals break duration, set focus session to true and count to focus duration.
      Else, increment countdown by one each second.
      */
      setSessionCountdown((currentSessionCountdown) => {
        if (focusSessionActive && currentSessionCountdown === (focusDuration * 60)) {
          new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
          console.log(focusSessionActive);
          setFocusSessionActive(!focusSessionActive);
          return currentSessionCountdown = 0;
        } else if (!focusSessionActive && currentSessionCountdown === (breakDuration * 60)) {
          console.log(focusSessionActive);
          new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
          setFocusSessionActive(!focusSessionActive);
          return currentSessionCountdown = 0;
        } else {
          return currentSessionCountdown += 1;
        }
      });
      
    },
    isTimerRunning ? 1000 : null
  );

  // This function stops and starts the timer
  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
  }

  // Handle what happens when the play/pause button is clicked
  const handlePlayPause = ({target}) => {

    // Set session to active when play is clicked
    if(!sessionActive) setSessionActive(true);

    // If the timer is not running and the current focus session is not active, start timer and focus session
    if(!focusSessionActive && sessionCountdown === 0) {
      setFocusSessionActive((currentFocusSession) => {
        return !currentFocusSession;
      })
    } 

    // Pause and play the timer
    playPause();  
}

  // Handle when stop button is clicked
  const handleStop = ({target}) => {
  // Return all states to their initial when stop button is clicked
  setIsTimerRunning(initialStates.isTimerRunning);
  setFocusDuration(initialStates.focusDuration);
  setBreakDuration(initialStates.breakDuration);
  setSessionCountdown(initialStates.sessionCountdown);
  setFocusSessionActive(initialStates.focusSessionActive);
  setSessionActive(initialStates.sessionActive);
  }

  return (
    <div className={classNames({
      "pomodoro": true,
    })}>
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* Completed: Update this text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* Completed: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                onClick={handleIncrementClick}
                className="btn btn-secondary"
                name="decrease-focus"
                data-testid="decrease-focus"
              >
                <span className="oi oi-minus" name="decrease-focus"/>
              </button>
              {/* Completed: Implement increasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                name="increase-focus"
                onClick={handleIncrementClick}
                data-testid="increase-focus"
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* Completed: Update this text to display the current break session duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* Completed: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  name="decrease-break"
                  onClick={handleIncrementClick}
                  data-testid="decrease-break"
                >
                  <span className="oi oi-minus" />
                </button>
                {/* Completed: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  onClick={handleIncrementClick}
                  className="btn btn-secondary"
                  name="increase-break"
                  data-testid="increase-break"
                  
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={handlePlayPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* Completed: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              onClick={handleStop}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* Completed: This area should show only when a focus or break session is running or pauses */}
        <div className={classNames({
               "row mb-2" : sessionActive,
                "d-none": !sessionActive,
                })}>
          <div className="col">
            {/* Completed: Update message below to include current session (Focusing or On Break) and total duration */}
            {sessionActive && <h2 data-testid="session-title">{focusSessionActive ? "Focusing" : "On Break" } for {focusSessionActive ? `${minutesToDuration(focusDuration)}` : `${minutesToDuration(breakDuration)}`} minutes</h2>}
            {/* Completed: Update message below to include time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration((focusDuration * 60) - sessionCountdown)} remaining
            </p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            {/* Progress bar only displays when session is active*/}
            <div className={classNames({
               "progress" : (sessionActive),
                "d-none": (!sessionActive),
                })} style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={ariaValue} // Completed: Increase aria-valuenow as elapsed time increases
                style={{ width: `${ariaValue}%` }} // Completed: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
