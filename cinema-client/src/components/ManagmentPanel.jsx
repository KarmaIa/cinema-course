import { useState, useEffect } from 'react';
import FilmCardManagment from './FilmCardManagment';
import FilmForm from './FilmForm';
import HallsList from './HallsList';
import SessionForm from './SessionForm';
import './ManagmentPanel.css';

function ManagmentPanel({ films, loadFilms }) {
    const [activeTab, setActiveTab] = useState('films');
    const [halls, setHalls] = useState([]);
    const [message, setMessage] = useState('');
    const [editingFilm, setEditingFilm] = useState(null);
    const [filmForm, setFilmForm] = useState({
        title: '',
        duration: '',
        description: '',
        age_rating: ''
    });

    // Единоразовое получения залов
    useEffect(() => {
        fetch('http://localhost:8000/api/get_all_halls.php')
            .then(res => res.json())
            .then(data => setHalls(data));
    }, []);

    // Показ сообщения на 3 секунды
    function showMessage(msg) {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    }

    // Удаление фильма
    function handleDeleteFilm(film_id) {
        if (!window.confirm('Вы уверены, что хотите удалить этот фильм?')) return;

        fetch('http://localhost:8000/api/delete_film.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: film_id })
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.error) alert(resData.error);
            else { 
                showMessage('Фильм удален!'); 
                loadFilms(); 
                cancelEdit(); 
            }
        });
    }

    // Перенос данных в форму
    function handleUpdateFilm(film) {
        setEditingFilm(film);
        setFilmForm({
            title: film.title,
            duration: film.duration_min,
            description: film.description,
            age_rating: film.age_rating
        });
    }

    // Отмена редактировния
    function cancelEdit() {
        setEditingFilm(null);
        setFilmForm({ title: '', duration: '', description: '', age_rating: '' });
    }

    // Запись в state данных полей для фильма
    function handleFilmChange(e) {
        const { name, value } = e.target;
        setFilmForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Создание или Обновление
    function handleSaveFilm(e) {
        e.preventDefault();
        
        const data = {
            title: filmForm.title,
            duration_min: filmForm.duration,
            description: filmForm.description,
            age_rating: filmForm.age_rating
        };

        const url = editingFilm 
            ? 'http://localhost:8000/api/update_film.php' 
            : 'http://localhost:8000/api/add_film.php';

        if (editingFilm) data.id = editingFilm.id;

        fetch(url, {
            method: editingFilm ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.error) alert(resData.error);
            else { 
                showMessage(editingFilm ? 'Фильм обновлен!' : 'Фильм добавлен!'); 
                cancelEdit();
                loadFilms(); 
            }
        });
    }

    // Добавление сеанса
    function handleAddSession(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            film_id: form.film_id.value,
            hall_id: form.hall_id.value,
            start_time: form.start_time.value,
            price: form.price.value
        };

        fetch('http://localhost:8000/api/add_session.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.error) alert(resData.error);
            else { 
                showMessage('Сеанс добавлен!'); 
                form.reset(); 
                loadFilms(); 
            }
        });
    }

    return (
        <div className='managment-panel'>
            <div className='managment-panel__header'>
                <h1>Управление кинотеатром</h1>
                {message && <div className='managment-panel__header__message'>{message}</div>}
            </div>
            
            <nav className='managment-panel__navigation'>
                <button onClick={() => setActiveTab('films')}>Фильмы</button>
                <button onClick={() => setActiveTab('sessions')}>Сеансы</button>
                <button onClick={() => setActiveTab('halls')}>Залы</button>
            </nav>

            {/* Вкладка фильмов */}
            {activeTab === 'films' && (
                <div className='managment-panel__film-tab'>
                    <FilmForm
                        handleSaveFilm={handleSaveFilm}
                        editingFilm={editingFilm}
                        filmForm={filmForm}
                        handleFilmChange={handleFilmChange}
                        cancelEdit={cancelEdit}
                    />
                    {/* Список фильмов */}
                    <div className='managment-panel__films-list'>
                        <h2>Список фильмов</h2>
                        {films.length === 0 ? (
                            <p className='managment-panel__films-list__empty'>На данный момент фильмов нет.</p>
                        ) : (
                            films.map(f => (
                            <FilmCardManagment
                                key={f.id}
                                film={f}
                                handleDeleteFilm={handleDeleteFilm}
                                handleUpdateFilm={handleUpdateFilm}
                            />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Вкладка сеансов */}
            {activeTab === 'sessions' && (
                <SessionForm 
                    handleAddSession={handleAddSession}
                    films={films}
                    halls={halls}
                />
            )}

            {/* Вкладка залов */}
            {activeTab === 'halls' && (
                <HallsList halls={halls}/>
            )}
        </div>
    );
}

export default ManagmentPanel;