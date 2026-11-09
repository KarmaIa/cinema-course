import './HallsList.css';

function HallsList({ halls }) {
    return (
        <div className="halls-list">
            <h2>Список залов</h2>
            <table className="halls-list__table">
                <thead className="halls-list__table__thead">
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Рядов</th>
                    <th>Мест в ряду</th>
                </tr>
                </thead>
                <tbody className="halls-list__table__tbody">
                {halls.map(h => (
                    <tr key={h.id}>
                    <td>{h.id}</td>
                    <td>{h.name}</td>
                    <td>{h.rows_count}</td>
                    <td>{h.seats_per_row}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default HallsList;