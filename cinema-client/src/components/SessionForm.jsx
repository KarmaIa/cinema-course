import './SessionForm.css';

function SessionForm({ handleAddSession, films, halls }) {
    return (
        <form className="session-form" onSubmit={handleAddSession}>
            <h2>Создать сеанс</h2>
            
            <label htmlFor='film_id'>Фильм:</label>
            <select name="film_id" id='film_id' required>
                <option value="">Выберите фильм</option>
                {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
            </select>

            <label htmlFor='hall_id'>Зал:</label>
            <select name="hall_id" id='hall_id' required>
                <option value="">Выберите зал</option>
                {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>

            <label htmlFor='start_time'>Дата и время:</label>
            <input 
                name="start_time" 
                id='start_time' 
                type="datetime-local" 
                required 
            />

            <label htmlFor='price'>Цена (руб):</label>
            <input 
                name="price" 
                id='price' 
                type="number" 
                placeholder="Например: 500" 
                required
                min={100}
                max={5000}
            />

            <button className="session-form__btn-create" type="submit">Создать сеанс</button>
        </form>
    )
}

export default SessionForm;