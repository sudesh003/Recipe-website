import './about_style.css';
import { FaHeart } from 'react-icons/fa';

function About() {
    
    return (
        <div className="about">
            <div className='title'>Cognimuse AI</div>
            <div className='subtitle'>Made by Sudesh with <FaHeart style={{ color: 'white' }} /> 
            </div>
        </div>
    );
}

export default About;
