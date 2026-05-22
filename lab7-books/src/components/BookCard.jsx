import React from 'react';
import './BookCard.css';

const BookCard = ({ coverUrl, title, authors }) => (
  <div className="book-card">
    <img src={coverUrl || ''} alt={title} className="book-cover" />
    <h3 className="book-title">{title}</h3>
    <p className="book-authors">{authors?.join(', ') || 'Автор неизвестен'}</p>
  </div>
);

export default BookCard;