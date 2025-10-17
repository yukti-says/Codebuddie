import { useState, useRef, useEffect } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../socket";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const username = location.state?.username;

  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      const handleErrors = (err) => {
        console.error("Socket error:", err);
        toast.error("Socket connection failed. Try again later.");
        navigate("/");
      };
      //? socket error handling
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      // New user joined
      socketRef.current.on("joined", ({ clients, username: joinedUser }) => {
        if (joinedUser !== username) {
          toast.success(`${joinedUser} joined the room.`);
        }
        setClients(clients);
      });

      // User left (manual or disconnect)
      socketRef.current.on("left", ({ clients, username: leftUser }) => {
        toast(`${leftUser} left the room.`);
        setClients(clients);
      });

      // Now emit join after listeners are attached
      socketRef.current.emit("join", { roomId, username });
    };

    init();

    // Cleanup socket when unmount
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("joined");
      socketRef.current?.off("left");
    };
  }, [roomId, username, navigate]);

  // Redirect if no username
  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  const copyRoomLink = async () => {
    try {
      const link = `${window.location.origin}/editor/${roomId}`;
      await navigator.clipboard.writeText(link);
      toast.success("Shareable link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
      console.error(err);
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leaveRoom", { roomId, username });
      socketRef.current.disconnect();
    }
    navigate("/");
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-light d-flex flex-column justify-content-between align-items-center">
          <div className="mt-4 text-center">
            <img
              src="/images/logo.png"
              alt="CodeBuddie"
              style={{ maxWidth: "100px" }}
            />
            <hr className="w-100" />
            <div className="overflow-auto w-100">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>

          <div className="p-2 w-100">
            <hr />
            <button
              className="btn btn-success w-100 mb-2"
              onClick={copyRoomLink}
            >
              Copy Link
            </button>
            <button className="btn btn-danger w-100" onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>

        {/* Editor Section */}
        <div className="col-md-10 d-flex flex-column h-100">
          <Editor
            socket={socketRef.current}
            roomId={roomId}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}

export default EditorPage;
