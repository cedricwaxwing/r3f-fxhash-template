import "./App.css";
import Experience from "./Experience";
// import { useFeatures } from "./common/FeaturesProvider";

function App() {
  // const { theme } = useFeatures();
  return (
    <div
      className="App"
      // style={{
      //   background:
      //     theme.background.length > 1
      //       ? `linear-gradient(${theme.background[0]}, ${theme.background[1]})`
      //       : theme.background[0],
      // }}
    >
      <Experience />
    </div>
  );
}

export default App;
