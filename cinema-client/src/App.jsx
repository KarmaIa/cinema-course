import { useEffect, useState } from 'react';
import './App.css';
import SessionList from './components/SessionList';
import SessionPlan from './components/SessionPlan';
import ManagmentPanel from './components/ManagmentPanel';
import FilmCard from './components/FilmCard';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';

function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isManagmentMod, setIsManagmentMod] = useState(false);

  // Загрузка списка сеансов
  function loadSessions() {
    fetch('http://localhost:8000/api/get_available_sessions.php')
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => setError(err.message));
  }

  // Загрузка списка фильмов
  function loadFilms() {
    fetch('http://localhost:8000/api/get_all_films.php')
      .then(res => res.json())
      .then(data => setFilms(data))
      .catch(err => setError(err.message));
  }

  useEffect(() => {
    loadSessions();
    loadFilms();
  }, []);

  // Возврат на главную страницу (сброс выбранного сеанса и режима админки)
  function goBack() {
    setSelectedSession(null);
    setMessage('');
    loadSessions();
    loadFilms();
    setIsManagmentMod(false);
  }

  // Загрузка схемы зала
  function handleSessionClick(sessionId) {
    fetch(`http://localhost:8000/api/get_session_details.php?id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedSession({
          id: sessionId,
          hall: data.hall,
          taken: data.taken_seats
        });
      })
      .catch(err => {
        setError(err.message);
      });
  }

  // Покупка билета
  function handleBuyTicket(row, seat, buyer_name) {
    if (!window.confirm(`Купить билет за ${selectedSession.hall.price} руб на ряд ${row}, место ${seat}?`)) return;

    fetch('http://localhost:8000/api/buy_ticket.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: selectedSession.id,
        row: row,
        seat: seat,
        buyer_name: buyer_name
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } 
      else {
        handleSessionClick(selectedSession.id);
        setMessage(data.message);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    })
    .catch(err => alert('Ошибка сети: ' + err.message));
  }

  // Занято ли место
  function isSeatTaken(row, seat) {
    if (!selectedSession) return false;
    return selectedSession.taken.some(t => t.row_number === row && t.seat_number === seat);
  }

  return (
    <>
      <SiteHeader
        buttonText={isManagmentMod ? '← Вернуться на сайт' : 'Управление кинотеатром'}
        onButtonClick={isManagmentMod ? goBack : () => setIsManagmentMod(true)}
      />
      <main className='main-container'>
        { isManagmentMod ? (
          <ManagmentPanel films={films} loadFilms={loadFilms} />
        ) : (
          <>
            {error && <p className='main-container__error'>Ошибка: {error}</p>}
            
            {/* Список сеансов и фильмов */}
            {!selectedSession && (
              <div className='main-container__sessions-films'>
                <SessionList
                  sessions={sessions}
                  handleSessionClick={handleSessionClick}
                />
                <div className='main-container__sessions-films__film-list'>
                    <h2>Список фильмов</h2>
                    {films.length === 0 ? (
                        <p className="main-container__sessions-films__film-list__empty">На данный момент фильмов нет.</p>
                    ) : (
                        films.map(f => (
                            <FilmCard
                                key={f.id}
                                film={f}
                            />
                        ))
                    )}
                </div>
              </div>
            )}

            {/* Схема зала */}
            {selectedSession && (
              <SessionPlan
                message={message}
                selectedSession={selectedSession}
                isSeatTaken={isSeatTaken}
                handleBuyTicket={handleBuyTicket}
                goBack={goBack}
              />
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

export default App;