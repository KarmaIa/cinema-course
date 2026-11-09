import './FilmCard.css';

function FilmCard({ film }) {
    return (
        <article className="film-card">
            <h1>{film.title} <span>({film.age_rating})</span></h1>
            <p>Описание: {film.description || 'Нет описания'}</p>
            <p>Длительность: {film.duration_min} мин.</p>
        </article>
    )
}

export default FilmCard;