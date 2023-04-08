import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Image, Navbar, Nav, Container, Row, NavDropdown } from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'
// import myLogo from './CreateXlogo-white.svg'
import myLogo from './logo_webflow.svg'
import history from '../history'

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
        history.push('/landing')
        window.location.reload()
    }


    return (
        <header >
            <Navbar 
                    
                    bg="dark" 
                    variant='dark' 
                    expand="lg" 
                    collapseOnSelect>
                <Container>

                    <LinkContainer to='/landing' style={{ height: '70px', width: '60%' }}>
                        <Navbar.Brand> 
                            <img 
                                src={myLogo} 
                                alt='CreateX'
                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                            />
                        </Navbar.Brand>
                    </LinkContainer>
                    

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox/>
                        

                        <Nav className="mr-auto">

                            <LinkContainer to='/home'>
                                <Nav.Link>Creators</Nav.Link>
                            </LinkContainer> 

                            <LinkContainer to='/favorites'>
                                <Nav.Link>Favorites</Nav.Link>
                            </LinkContainer> 

                            <NavDropdown title="About" id='about'>
                                <LinkContainer to='/policy'>
                                    <NavDropdown.Item>Policy</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>

                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to='/portfolio'>
                                        <NavDropdown.Item>Portfolio</NavDropdown.Item>
                                    </LinkContainer>

                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link><i className='fas fa-user'></i>Login</Nav.Link>
                                </LinkContainer>
                            )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header