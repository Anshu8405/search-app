import logo from './logo.svg';
import './App.css';
import Search from './components/Search';

function App() {
  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="container-fluid">
        <Search />
      </div>
    </>
  );
}

export default App;
