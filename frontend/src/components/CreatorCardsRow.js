import React from 'react'

import { Card } from 'react-bootstrap'
import CreatorCard from './CreatorCard';

const cardsData = [
  { title: "Card 1", content: "This is card 1 content" },
  { title: "Card 2", content: "This is card 2 content" },
  { title: "Card 3", content: "This is card 3 content" },
];

const CreatorCardsRow = () => {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {cardsData.map((card) => (
        <Card className="my-3 p-3 rounded-0" key={card.title} style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{card.title}</Card.Title>
            <Card.Text>{card.content}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};



export default CreatorCardsRow