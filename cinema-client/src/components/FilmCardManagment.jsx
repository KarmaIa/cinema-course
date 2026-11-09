import './FilmCard.css';

function FilmCardManagment({ film, handleDeleteFilm, handleUpdateFilm }) {
    return (
        <article className="film-card">
            <h1>{film.title} <span>({film.age_rating})</span></h1>
            <p>Описание: {film.description || 'Нет описания'}</p>
            <p>Длительность: {film.duration_min} мин.</p>
            
            <div className='film-card__btns'>
                <button className="film-card__btn-edit" onClick={() => handleUpdateFilm(film)}>Редактировать</button>
                <button className="film-card__btn-delete" onClick={() => handleDeleteFilm(film.id)}>Удалить</button>
            </div>
        </article>
    )
}

export default FilmCardManagment;