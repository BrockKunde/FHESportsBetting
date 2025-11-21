import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import FHEVMStatus from './components/FHEVMStatus';
import EncryptionDemo from './components/EncryptionDemo';
import DecryptionDemo from './components/DecryptionDemo';
import CodeExample from './components/CodeExample';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>FHEVM SDK</h1>
          <p>React Example with TypeScript</p>
        </div>

        <WalletConnect
          onConnect={(address) => {
            setIsConnected(true);
            setUserAddress(address);
          }}
        />

        <FHEVMStatus
          isConnected={isConnected}
          onInitialized={(initialized) => setIsInitialized(initialized)}
        />

        <EncryptionDemo
          isEnabled={isInitialized}
          userAddress={userAddress}
        />

        <DecryptionDemo
          isEnabled={isInitialized}
          userAddress={userAddress}
        />

        <CodeExample />
      </div>
    </div>
  );
}

export default App;
