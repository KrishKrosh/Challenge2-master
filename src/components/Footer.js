import React from "react";

const footerStyle = {
  backgroundColor: "#F50057",
  fontSize: "20px",
  color: "white",
  textAlign: "center",
  padding: "12px",
  height: "50px",
  width: "100%",
};

function Footer() {
  return (
    <div style={footerStyle}>
      <p>© YouthComputing 2020 </p>
    </div>
  );
}

export default Footer;
