const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
};

export default FullScreenLoader;
