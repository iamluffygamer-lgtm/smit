import React from 'react';
import { useOSStore } from '../os/store/osStore';
import { Desktop } from '../os/core/Desktop';
import { BootScreen } from '../os/core/BootScreen';
import '../os/styles/os.css';

import { ThemeProvider } from '../os/system/ThemeProvider';

function App() {
  const isBooted = useOSStore(state => state.isBooted);

  return (
    <ThemeProvider>
      {!isBooted && <BootScreen />}
      {isBooted && <Desktop />}
    </ThemeProvider>
  );
}

export default App;
