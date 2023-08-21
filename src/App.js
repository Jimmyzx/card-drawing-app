import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [deckId, setDeckId] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [cards, setCards] = useState([]);
  const intervalRef = useRef();

  useEffect(() => {
    async function createDeck() {
      try {
        const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        setDeckId(response.data.deck_id);
        setRemaining(response.data.remaining);
        setCards([]);
      } catch (error) {
        console.error('Error creating deck:', error);
      }
    }
    createDeck();
  }, []);

  const drawCard = async () => {
    if (remaining === 0) {
      alert('Error: no cards remaining!');
      shuffleDeck();
      return;
    }

    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      const drawnCard = response.data.cards[0];
      setRemaining(response.data.remaining);
      setCards([...cards, drawnCard]);
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  const toggleDrawing = () => {
    if (!drawing) {
      intervalRef.current = setInterval(drawCard, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    setDrawing(!drawing);
  };

  const shuffleDeck = async () => {
    clearInterval(intervalRef.current);
    try {
      await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      setRemaining(52);
      setCards([]);
      setDrawing(false);
    } catch (error) {
      console.error('Error shuffling deck:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Card Drawing App</h1>
        <div className="deck">
          {remaining > 0 ? (
            cards.map((card, index) => (
              <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} />
            ))
          ) : (
            <p>No cards remaining in the deck.</p>
          )}
        </div>
        <p>Remaining cards: {remaining}</p>
        <button onClick={toggleDrawing}>
          {drawing ? 'Stop Drawing' : 'Start Drawing'}
        </button>
        <button onClick={shuffleDeck} disabled={drawing}>
          Shuffle Deck
        </button>
      </header>
    </div>
  );
}

export default App;
