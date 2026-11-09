import './FilmForm.css';

function FilmForm({ handleSaveFilm, editingFilm, filmForm, handleFilmChange, cancelEdit }) {
    return (
        <div className="film-form-wrapper">
            <form className="film-form" onSubmit={handleSaveFilm}>
                <h2>{editingFilm ? 'Редактировать фильм' : 'Добавить фильм'}</h2>
                
                <input 
                    name="title" 
                    type="text" 
                    placeholder="Название фильма" 
                    required 
                    value={filmForm.title} 
                    onChange={handleFilmChange} 
                />
                <input 
                    name="duration" 
                    type="number" 
                    placeholder="Длительность (мин)" 
                    required
                    min={20}
                    max={300}
                    value={filmForm.duration} 
                    onChange={handleFilmChange} 
                />
                <textarea 
                    name="description" 
                    placeholder="Описание" 
                    rows="3"
                    value={filmForm.description} 
                    onChange={handleFilmChange}
                ></textarea>
                <select 
                    name="age_rating" 
                    value={filmForm.age_rating} 
                    onChange={handleFilmChange}
                    required
                >
                    <option value="0+">0+</option>
                    <option value="6+">6+</option>
                    <option value="12+">12+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                </select>
                
                <button className="film-form__btn-save-film" type="submit">
                    {editingFilm ? 'Сохранить изменения' : 'Добавить фильм'}
                </button>
                
                {editingFilm && (
                    <button className="film-form__btn-cancel" type="button" onClick={cancelEdit}>
                        Отменить
                    </button>
                )}
            </form>
        </div>
    )
}

export default FilmForm;