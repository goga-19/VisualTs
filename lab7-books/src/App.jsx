import { useState, useEffect } from 'react';
import BookCard from './components/BookCard';
import './App.css';

const BOOKS_API = 'https://fakeapi.extendsclass.com/books';

async function fetchCoverBlob(isbn) {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const thumb = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (!thumb) return null;

    const imgRes = await fetch(thumb);
    const blob = await imgRes.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.warn(`Обложка для ${isbn} не загружена:`, e);
    return null;
  }
}

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const blobUrls = [];

    async function load() {
      try {
        console.log('📡 Запрос к API книг...');
        const res = await fetch(BOOKS_API);
        if (!res.ok) throw new Error(`Сервер вернул ${res.status}`);
        
        const list = await res.json();
        console.log('✅ Книги получены:', list.length);

        const withCovers = await Promise.all(
          list.map(async (book) => {
            const url = await fetchCoverBlob(book.isbn);
            if (url) blobUrls.push(url);
            return { ...book, coverUrl: url };
          })
        );

        if (isMounted) {
          setBooks(withCovers);
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
      blobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Загрузка...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: '#d32f2f' }}>Ошибка: {error}</p>;

  return (
    <div className="app">
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Каталог книг</h2>
      <div className="books-grid">
        {books.map(b => (
          <BookCard key={b.id} coverUrl={b.coverUrl} title={b.title} authors={b.authors} />
        ))}
      </div>
    </div>
  );
}

export default App;