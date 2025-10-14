import { useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { useRef } from "react";
import { useEffect } from "react";
import { initSocket } from "../socket";
import { useLocation, useParams } from 'react-router-dom'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";






function EditorPage() {

  const navigate = useNavigate();

  //* getting roomId and username from url
  const location = useLocation();
  const { roomId } = useParams();
  const username = location.state?.username;


  //* using useRef to store the clients or instances of client bz using useRef when value will change it will not cause re-render of the component
  const socketRef = useRef(null) 

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      // handle error
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      const handleErrors = (err) => {
        console.log("socket error", err);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
        
      };
      socketRef.current.on('connect_failed', (err) => handleErrors(err));
      //* now sending a event to server that we are connected
      socketRef.current.emit('join', {
        roomId,
        username
      })
    }
    init();
  },[])
  
  const [client, setClient] = useState([
    { socketId: 1, username: "Yukti " },
    { socketId: 2, username: "Anu" },
    { socketId: 2, username: "shanj" },
    { socketId: 2, username: "gunni" },
  ]);

  //if no username is present then navigate to home page
  useEffect(() => {
    if(!location.state){
      navigate("/");
    }
  },[])

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
