import './App.css';
import { Tickers } from './Tickers';
import SignUp from "./SignUp";
import SignIn from "./SignIn";


function App() {
  return (
    <div>
        <SignUp />
        <SignIn />
        <Tickers />
    </div>
  );
}

export default App;
