import './App.css';
// import { ChatBot } from './components/chat/ChatBot';
import { ReviewList } from "./components/reviews/ReviewList";

function App() {
   return (
      <div className="p-4 h-screen w-2xl">
         <ReviewList productId={4} />
      </div>
   );
}

export default App;
