import './SiteHeader.css'

function SiteHeader({ buttonText, onButtonClick }) {
    return (
        <header className="site-header">
            <nav className='site-nav' aria-label='Основная навигация'>
                <a href="#">Кинотеатр Мир</a>

                <button className="site-header__btn" onClick={onButtonClick}>
                    {buttonText}
                </button>
            </nav>
        </header>
    );
}

export default SiteHeader