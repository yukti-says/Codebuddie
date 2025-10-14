import { useState } from "react";
import Client from "./Client";
import Editor from "./Editor";




function EditorPage() {
  
  const [client, setClient] = useState([
    { socketId: 1, username: "Yukti " },
    { socketId: 2, username: "Anu" },
    { socketId: 2, username: "shanj" },
    { socketId: 2, username: "gunni" },
  ]);


  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div
          className="col-md-2 bg-dark text-light d-flex flex-column h-100 justify-content-between align-items-center"
          style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}
        >
          {/* Top Section with Centered Logo */}
          <div className="d-flex flex-column align-items-center mt-4">
            <img
              src="/images/logo.png"
              alt="CodeBuddie"
              className="img-fluid"
              style={{ maxWidth: "100px" }}
            />
            <hr className="w-100" style={{ marginTop: "1rem" }} />
            {/* Client list container */}
            <div className="d-flex flex-column overflow-auto w-100">
              {
                client.map((client) => {
                  return <Client key={client.socketId} username={client.username} />;
                })
              }

            </div>
          </div>

          {/* Buttons at bottom */}
          <div className="p-2 w-100">
            <hr />
            <button className="btn btn-success w-100 mb-2">Copy Room Id</button>
            <button className="btn btn-danger w-100">Leave Room</button>
          </div>
        </div>

        {/* Editor Section */}
        <div className="col-md-10 text-light d-flex flex-column h-100">
          {/* Main content goes here */}

         <Editor/>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
