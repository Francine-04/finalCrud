// confirm.js
import React from "react";
import { createRoot } from "react-dom/client";

const showConfirm = (message, onConfirm, onCancel) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const handleConfirm = () => {
    root.unmount();
    container.remove();
    onConfirm();
  };

  const handleCancel = () => {
    root.unmount();
    container.remove();
    if (onCancel) onCancel();
  };

  root.render(
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p>{message}</p>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={handleConfirm}>Confirm</button>
          <button style={styles.button} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "14px",
  },
};

export default showConfirm;
