import { useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

import Skeleton from "react-loading-skeleton"; // Import the skeleton loader
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

marked.use({ gfm: true });

function App() {
  const [serverData, setServerData] = useState({ html: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    setLoading(true); // Set loading to true at the start
    setError(null); // Reset error before fetching
    setServerData(""); // Clear previous server data

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
          setServerData({ html }); // Update server data
          inputRef.current.focus();
          setUserPrompt("");
        })
        .catch((err) => {
          console.error("Error", err);
          setError(err.message); // Set error message
        })
        .finally(() => {
          setLoading(false); // Set loading to false after fetching
        });
    } else {
      setLoading(false); // Ensure loading is set to false if no user prompt
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
          {loading ? (
            <div>
              <Skeleton
                height={30}
                width={`70%`}
                style={{ borderRadius: "8px" }}
              />
              {/* Title Skeleton */}
              <Skeleton
                count={3}
                height={20}
                width={`70%`}
                style={{ borderRadius: "8px" }}
              />
              {/* Paragraph Skeletons */}
              {/* <Skeleton height={200} style={{ borderRadius: "8px" }} />{" "} */}
              {/* Image Skeleton */}
            </div>
          ) : error ? (
            <div style={{ color: "red" }}>Error: {error}</div>
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
