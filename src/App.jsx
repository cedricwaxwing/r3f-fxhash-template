import "./App.css";
import Experience from "./Experience";
import { useFeatures } from "./common/FeaturesProvider";

function App() {
  const { theme } = useFeatures();
  return (
    <div className="App" style={{ backgroundColor: theme.background }}>
      <Experience />
    </div>
  );
}

export default App;
