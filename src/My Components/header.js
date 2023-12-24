import './header_style.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FaBars } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import { FaUser } from 'react-icons/fa';

function Header() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState('');
    useEffect(() => {

        fetch('http://localhost:5000/api/getUserName', {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setUserName(data.userName);
                // console.log('Fetched user name:', data.userName); // Log the userName to the console
            })
            .catch(error => {
                console.error('Error fetching user name:', error);
            });

    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent the form from submitting and reloading the page
        
        const lowercaseSearchTerm = searchTerm.toLowerCase(); // Convert searchTerm to lowercase
        navigate(`/info/${lowercaseSearchTerm}`); // Navigate to the info page with the lowercase search term
      };
      

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term state as the user types

    };

    const handleButtonClick = () => {
        navigate(`/signup`); // Navigate to the signup page
    };

    const handleLogoutButtonClick = () => {
        // Send a request to the server to log out the user
        fetch('http://localhost:5000/logout', {
            credentials: 'include'
        })
        
        setUserName('');
    };


    return (
        <div className="navbar">
            <div className='dropdown'>
                <DropdownButton id="dropdown-basic-button" title={<FaBars />} className="custom-dropdown">
                    <Dropdown.Item as={Link} to="/favorite">Favorites</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/about">About</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className='main-heading'>Kitchen Bells</div>
            <div className='searchbar'>
                <Form onSubmit={handleSearchSubmit} inline="true">
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="text"
                                placeholder="Search recipe..."
                                className=" mr-sm-2"
                                value={searchTerm}
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className='user'>
                <button className='user-btn' onClick={handleButtonClick}>
                    {userName ? userName.charAt(0).toUpperCase() : <FaUser />}
                </button>
            </div>
            {userName && (
                <div className='logout'>
                    <button className='logout-btn' onClick={handleLogoutButtonClick}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Header;
