import React, { useState, useEffect } from "react";

function App() {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("https://ecommerce-vscs.onrender.com/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
      }
    )
  }, []);

  return (
    <div>
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        backendData.users.map((user, index) => {
          return <p key={index}>{user}</p>;
        })
      )}
    </div>
  );
}

export default App;
