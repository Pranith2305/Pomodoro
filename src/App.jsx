import './App.css';
import Timer from "./timer/Timer";
import {useState} from "react";
import SettingsContext from "./timer/SettingsContext";
import MoreSettings from './timer/MoreSettings';

function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);

  return (
    <main>
      <SettingsContext.Provider value={{
        workMinutes,
        breakMinutes,
        showSettings,
        setWorkMinutes,
        setBreakMinutes,
        setShowSettings,
      }}>
        {showSettings ? <MoreSettings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}

export default App;