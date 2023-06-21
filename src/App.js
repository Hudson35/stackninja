import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import CalendarHeatmap from "react-calendar-heatmap";
import { FaUserNinja } from 'react-icons/fa';
import "react-calendar-heatmap/dist/styles.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./App.css"

const ProgressTracker = () => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const storedProgressData = localStorage.getItem("progressData");
    if (storedProgressData) {
      setProgressData(JSON.parse(storedProgressData));
    }
  }, []);

  const trackProgress = () => {
    const currentDate = new Date();
    const updatedProgressData = [
      ...progressData,
      { date: currentDate.toISOString().slice(0, 10), count: 0 },
    ];
    setProgressData(updatedProgressData);
    localStorage.setItem("progressData", JSON.stringify(updatedProgressData));
  };

  const getClassForValue = (value) => {
    if (!value) {
      return "color-empty";
    }
    const count = value.count || 0;

    const today = new Date();
    const lastSevenDays = new Date(today);
    lastSevenDays.setDate(today.getDate() - 6);

    if (new Date(value.date) >= lastSevenDays) {
      return "color-scale-green";
    }

    return `color-scale-${Math.min(count, 4)}`;
  };

  return (
    <div>
      <h2>Progress Tracker</h2>
      <div style={{ height: "100%" }}>
        <CalendarHeatmap
          startDate={new Date("2023-01-01")}
          endDate={new Date("2023-12-31")}
          values={progressData}
          classForValue={getClassForValue}
        />
      </div>
    </div>
  );
};

const App = () => {

  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const [question, setQuestion] = useState(`
    <div>
      <h1>Counter</h1>
      <p>Design a React component called "Counter" that implements a basic counter functionality. The component should have the following features:</p>
      <ul>
        <li>A counter value that starts at 0.</li>
        <li>A button labeled "Increment" that increases the counter value by 1 when clicked.</li>
        <li>A button labeled "Decrement" that decreases the counter value by 1 when clicked.</li>
        <li>The counter value should be displayed on the screen.</li>
      </ul>
      <p>Your task is to implement the "Counter" component in React and ensure that it behaves as described.</p>
    </div>
  `);

  const [code, setCode] = useState("");

  const handleSubmit = () => {
    console.log("Submitted code:", code);
  };

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setApiKey("");
    setOpen(false)
  };

  const handleApiKeySubmit = async (e) => {
    e.preventDefault();
    console.log("API Key:", apiKey);
  }

  return (
    <>
    <nav
      style={{
        display: "flex",
        background: "#272727",
        justifyContent: "space-between",
        padding: "20px 50px 0px 50px",
      }}
    >
      <div 
        style={{ 
          color: "white",
          fontSize: "30px",
          display: "flex",
        }}
      >
        Stack Ninja
        <FaUserNinja style={{padding: "5px", color: '#70b1a1'}}/>
      </div>
      <div>
        <button
            onClick={onOpenModal}
            style={{
              backgroundColor: "#70b1a1",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            ChatGPT API Keys
          </button>
      </div>
    </nav>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "50px",
        background: "#272727",
        color: "#fff",
      }}
    >
      <div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              flex: "1",
              marginRight: "10px",
              border: "1px solid #ddd",
              padding: "10px",
              background: "#1a1a1a",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: question }} />
          </div>
          <div
            style={{
              flex: "1",
              border: "1px solid #ddd",
              padding: "10px",
              background: "#1a1a1a",
            }}
          >
            <Editor
              height="400px"
              defaultLanguage="javascript"
              value={code}
              onChange={setCode}
              theme="vs-dark"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "20px",
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
        <ProgressTracker />
      </div>
    </div>
    <Modal 
      open={open} 
      onClose={onCloseModal} 
      center 
      classNames={{
        overlay: 'customOverlay',
        modal: 'customModal',
      }}>
      <form 
        onSubmit={handleApiKeySubmit} 
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px",
        }}
      >
        <h2 
          style={{
            margin: "auto",
            padding: "10px",
          }}
        >
          Enter Your ChatGPT API Key
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            margin: "auto",
            padding: "10px",
          }}
        >
          <input 
            type="text"  
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter key..."
            style={{
              display: "flex",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              paddingRight: "0.75rem",
              paddingLeft: "1rem",
              backgroundColor: "#ffffff",
              borderRadius: "0.375rem",
              borderWidth: "1px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          />
          <button 
            type="submit"
            disabled={apiKey === ""}
            style={{
              backgroundColor: "#70b1a1",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "15px",
            }}  
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
    </>
  );
};

export default App;
