import kidstablelogo from './kidstablelogo.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={kidstablelogo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://www.youtube.com/channel/UCv-i7fLnvX2iJjmoukFbMsQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Kids Table - where a kid can be a kid
        </a>
      </header>
      <p>
          Application version: {process.env.REACT_APP_VERSION}
      </p>
    </div>
  );
}

export default App;
