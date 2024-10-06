import { useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.use({ gfm: true });

function App() {
  const [serverData, setServerData] = useState({ html: "" });
  const [userPrompt, setUserPrompt] = useState("");
  const inputRef = useRef(null);

  function handldeKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      inputRef.current.blur();
      handleSubmit();
    }
  }

  function handleSubmit() {
    setServerData("");
    if (userPrompt !== "") {
      fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          const html = DOMPurify.sanitize(marked(data));
          setServerData((prevState) => ({
            ...prevState, // Spread previous state
            html: html, // Update only the html property
          }));
          inputRef.current.focus();
          setUserPrompt("");
          // console.log(html);
          // console.log("success");
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  }

  return (
    <main
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      className="container"
    >
      <h1 style={{ padding: "10px" }}>My Prompter</h1>
      <div
        style={{
          margin: "0",
          flexGrow: "1",
          overflowY: "scroll",
          marginBottom: "1rem",
        }}
      >
        <div style={{ margin: "0", width: "100%", height: "100%" }}>
          {serverData === "" ? (
            "Loading ..."
          ) : (
            <article
              style={{ margin: "0" }}
              dangerouslySetInnerHTML={{ __html: serverData.html }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          justifyContent: "center",
        }}
      >
        <textarea
          name=""
          id=""
          style={{ margin: "0", flexGrow: "1", overflowY: "hidden" }}
          placeholder="Type in Prompt ..."
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={handldeKeyDown}
          ref={inputRef}
          value={userPrompt}
        ></textarea>
        <button
          style={{ margin: 0, flex: "1", marginLeft: "10px" }}
          onClick={handleSubmit}
        >
          Go
        </button>
      </div>
    </main>
  );
}

export default App;
