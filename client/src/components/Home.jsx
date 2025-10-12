const Home = () => {
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
                >
                  Join
                </button>
                <p className="mb-0">
                  Don't have an invite?{" "}
                  <a href="#" className="text-success fw-bold">
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
