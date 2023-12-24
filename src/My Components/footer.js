import './footer_style.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="footer">
            <p>&copy; {currentYear} Cognimuse AI. All rights reserved.</p>
        </div>
    );
}

export default Footer;
