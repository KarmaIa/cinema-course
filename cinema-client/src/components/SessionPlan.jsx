import { useState } from 'react';
import './SessionPlan.css';

function SessionPlan({ message, selectedSession, isSeatTaken, handleBuyTicket, goBack}) {
    const [buyerName, setBuyerName] = useState('');

    return (
        <div className="session-plan">
            <button className='session-plan__btn-back' onClick={goBack}>
                ← Назад к сеансам
            </button>
            
            <div className='session-plan__info'>
                <h2>Фильм: {selectedSession.hall.film_title}</h2>
                <h3>Цена: {selectedSession.hall.price} Рублей</h3>
            </div>
            <div className='session-plan__buyer'>
                <label htmlFor="buyer_name">Введите имя: </label>
                <input
                    type="text" 
                    id="buyer_name" 
                    name="buyer_name"
                    placeholder='Опционально'
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                />
            </div>
            
            <div className='session-plan__title'>
                <h2>Выбор места</h2>
                {message && <p className='session-plan__title__message'>{message}</p>}
            </div>
            
            <div className='session-plan__display-places'>
                <h2 className='session-plan__display-places__title'>ЭКРАН</h2>
                
                {Array.from({ length: selectedSession.hall.rows_count }).map((_, rIndex) => {
                    const row = rIndex + 1;
                    return (
                        <div className='session-plan__display-places__hall-row' key={row}>
                            {Array.from({ length: selectedSession.hall.seats_per_row }).map((_, sIndex) => {
                                const seat = sIndex + 1;
                                const taken = isSeatTaken(row, seat);

                                return (
                                    <button
                                        className='session-plan__display-places__hall-row__seat'
                                        key={seat}
                                        disabled={taken}
                                        onClick={() => handleBuyTicket(row, seat, buyerName)}
                                        style={{
                                            cursor: taken ? 'not-allowed' : 'pointer',
                                            background: taken ? '#555' : '#4caf50',
                                        }}
                                        title={`Ряд ${row}, Место ${seat}`}
                                    >
                                        {seat}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default SessionPlan;