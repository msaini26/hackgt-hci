import * as React from "react";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { signInWithGoogle, signOutUser } from "./firebase";

const textString = "We ignite opportunity by setting the world in motion.";

function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("User info:", user.displayName, user.email);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Dev Help</h1>

      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Type your username..."
        clearOnEscape
        overrides={{
          Root: {
            style: {
              maxWidth: "300px",
              margin: "20px auto",
              borderRadius: "5px",
            },
          },
        }}
      />
      <p>Current value: {username}</p>
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Type your password..."
        clearOnEscape
        overrides={{
          Root: {
            style: {
              maxWidth: "300px",
              margin: "20px auto",
              borderRadius: "5px",
            },
          },
        }}
      />
      <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
      <Button onClick={handleSignOut} style={{ marginLeft: "10px" }}>
        Sign Out
      </Button>
    </div>
  );
}

export default App;
