import SessionCard from "./SessionCard";
import './SessionList.css';

function SessionList({ sessions, handleSessionClick }) {
    return (
        <div className="session-list">
            <h2>Расписание сеансов</h2>
            <div className="session-list__items">
                {sessions.length === 0 ? (
                    <p className="session-list__empty">На данный момент сеансов нет. Загляните позже!</p>
                ) : (
                    sessions.map(s => (
                        <SessionCard
                            key={s.id}
                            session={s}
                            handleSessionClick={handleSessionClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default SessionList;