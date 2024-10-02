import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import Contacts from './components/Contacts';
import Welcome from './components/Welcome';
import Chat from './pages/Chat';



function App() {



  return (
    <Router>
      <Routes>

        <Route path='/' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/setAvatar' element={<SetAvatar />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/welcome' element={<Welcome />} />

        

      </Routes>
    </Router>
  );
}

export default App;
