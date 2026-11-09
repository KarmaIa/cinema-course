import './SessionCard.css';

function SessionCard({ session, handleSessionClick }) {
    // Форматирование даты из БД в DD-MM-YYYY HH:MM
    const date = new Date(session.start_time);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

    // Свободные места
    const totalSeats = session.rows_count * session.seats_per_row;
    const availableSeats = totalSeats - session.sold_count;

    return (
        <article 
            className="session-card"
            onClick={() => handleSessionClick(session.id)}
        >
            <h3>{session.film_title}</h3>
            <p>{formattedDate} | {session.hall_name} | {session.price} руб.</p>

            <p className="session-card__availableSeats" style={{ 
                color: availableSeats > 0 ? '#4caf50' : 'red'
            }}>
                {availableSeats > 0 ? `Свободно мест: ${availableSeats} из ${totalSeats}` : 'Все места проданы!'}
            </p>
        </article>
    );
}

export default SessionCard;