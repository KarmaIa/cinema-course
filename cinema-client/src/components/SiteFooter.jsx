import './SiteFooter.css'

function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="site-footer__container">
                <section className="site-footer__container__section">
                    <h3>Кинотеатр Мир</h3>
                    <p>
                        Кинематограф для вашего досуга
                    </p>
                </section>
                
                <section className="site-footer__container__section">
                    <h4>Контакты</h4>
                    <p>info@cinema.ru</p>
                    <p>+7 (999) 123-45-67</p>
                </section>
                
                <section className="site-footer__container__section">
                    <h4>Соцсети</h4>
                    <a href="#">Telegram</a>
                    <a href="#">VK</a>
                    <a href="#">YouTube</a>
                </section>
            </div>
            <hr/>
            <div className="site-footer__bottom">
                <p>
                    Кинотеатр Мир. Все права защищены.
                </p>
            </div>
        </footer>
    )
}

export default SiteFooter