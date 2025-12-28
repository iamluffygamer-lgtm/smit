import React from 'react';
import { useOSStore } from '../os/store/osStore';
import { Desktop } from '../os/core/Desktop';
import { BootScreen } from '../os/core/BootScreen';
import '../os/styles/os.css';

function App() {
  const isBooted = useOSStore(state => state.isBooted);

  return (
    <>
      {!isBooted && <BootScreen />}
      {isBooted && <Desktop />}
    </>
  );
}

export default App;
