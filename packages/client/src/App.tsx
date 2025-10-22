import { useEffect, useState } from 'react';
import './App.css';
import { ChatBot } from './components/ChatBot';

function App() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api/hello')
         .then((response) => response.json())
         .then((data) => setMessage(data.message))
         .catch((error) => console.error('Error fetching data:', error));
   }, []);

   return (
      <div>
         <h1>Hello, {message}!</h1>
         <ChatBot />
      </div>
   );
}

export default App;
