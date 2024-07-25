import './App.css';
// import { Tickers } from './Tickers';
// import SignUp from "./SignUp";
import PageSignIn from "./PageSignIn";
// import {isAuthenticated} from "./authService";
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import {PageHome} from "./PageHome";
// import {isAuthenticated} from "./authService";


function App() {

    return (
    <BrowserRouter>
      <Routes>
        {/*<div>*/}
        {/*    <Route path="/" element={isAuthenticated() ? <PageHome /> : <Navigate replace to="/login" />} />*/}
            <Route path="/" element={<PageHome />} />
            <Route path="/login" element={<PageSignIn />} />

            {/*{!isAuthenticated() && <div>*/}
            {/*    <SignUp />*/}
            {/*    <PageSignIn />*/}
            {/*</div>*/}
            {/*}*/}
            {/*{isAuthenticated() && <div>*/}
            {/*    <input type="button" value="Log out" onClick={handleLogOut} />*/}
            {/*    <Tickers />*/}
            {/*</div>*/}
            {/*}*/}
        {/*</div>*/}
      </Routes>
    </BrowserRouter>
    );
}

export default App;
