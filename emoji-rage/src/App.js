import * as React from "react";
import { Input } from "baseui/input";
import { useStyletron } from "baseui";
import {
  DisplayLarge,
  DisplayMedium,
  DisplaySmall,
  DisplayXSmall,
} from "baseui/typography";

const textString = "We ignite opportunity by setting the world in motion.";


function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [css, theme] = useStyletron();

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

      
    </div>
  );
}

export default App;

