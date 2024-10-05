import { useState } from "react";

import { Login } from "./components/login/Login";
import { Chat } from "./components/chat/Chat";
import { Navbar } from "./components/layout/Navbar";



function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
  <>
    <Navbar/>
    <div className="app">
      {currentUser ? (
        <Chat currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
        ) : (
          <Login onLogin={setCurrentUser} />
          )}
      </div>
  </>
  );
}

export default App;