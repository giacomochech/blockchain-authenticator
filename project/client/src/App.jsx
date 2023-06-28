import { EthProvider } from "./contexts/EthContext";
import Demo from "./components/App";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Demo />
          <hr />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
