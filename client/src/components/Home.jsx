import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

const Home = () => {
  //* state for storing roomId and username
  const [roomId, setRoomId] = useState("");
  const [username, setUserName] = useState("");
  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room Id Generated");
  };

  //* method for joinning the room
  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error("Both fileds are required!");
      return;
    }

    //* from where we are going or entering into the editor page meaning from home to editor page we are going so we can also send some data along with it.
    navigate(`/editor/${roomId}`, { state: { username } });
    toast.success("Room is created!");
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100 d-flex">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body text-center bg-dark text-white rounded">
              <img
                className="img-fluid mx-auto d-block mb-2"
                src="/images/logo.png"
                alt="CodeBuddie"
                style={{ maxWidth: "100px" }}
              />
              <h4 className="card-title mb-4">Join a Room</h4>
              <form>
                <div className="form-floating mb-3">
                  <input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    type="text"
                    className="form-control"
                    id="roomIdInput"
                    placeholder="Room ID"
                  />
                  <label htmlFor="roomIdInput" className="text-muted">
                    Room ID
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    className="form-control"
                    id="usernameInput"
                    placeholder="Username"
                  />
                  <label htmlFor="usernameInput" className="text-muted">
                    Username
                  </label>
                </div>
                <button
                  className="btn btn-success btn-lg w-100 mb-3"
                  type="submit"
                  onClick={joinRoom}
                >
                  Join
                </button>
                <p className="mb-0">
                  Don't have an invite?{" "}
                  <a
                    onClick={generateRoomId}
                    href="#"
                    className="text-success fw-bold"
                  >
                    Create a new room
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
