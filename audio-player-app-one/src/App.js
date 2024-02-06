import './App.css';
import NavBar from './components/NavBar';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <div className="container">
      <NavBar></NavBar>
      <main className='App'>
        <h1>Welcome to our website!</h1>
        <p>This is a simple audio player website created using ReactJS.</p>
        <hr />
        <AudioPlayer></AudioPlayer>
      </main>
    </div>
  );
}

export default App;
