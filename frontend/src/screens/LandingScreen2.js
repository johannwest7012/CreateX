import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button, Image } from 'react-bootstrap'
import Creator from '../components/Creator'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CoverPic from '../components/CoverPic'
import CreatorGrid from '../components/CreatorGrid'

import heroimg from './images/createxheroimg1.png'

// import { listCreators } from '../actions/creatorActions'

// className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}
function LandingScreen2() {

    

    return (
        <Container>
            <Container className="hero-section intro" style={{ height: '95vh', marginBottom: '0px' }}>
                <Container >
                    <Row className="justify-content-center align-items-center" style={{ height: '50%' }}>
                        <Col className="justify-content-center">
                            <h1 className='display'>Invest In</h1>
                            <h1 className='display _3'>Creators</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget mauris quis lorem fringilla auctor. Suspendisse mollis ipsum quis mi lobortis, sed aliquam nulla iaculis.</p>
                            
                            <Button 
                                size='lg'
                                className='btn-block' 
                                type='button'
                                variant='dark'
                                href="/home">
                                Let's go
                            </Button>
                            
                            
                        </Col>
                        </Row>
                        <Row style={{ height: '50%' }}>
                        <Col>
                            {/* Put other content here */}
                        </Col>
                    </Row>
                </Container>
                
            </Container>
            <Row style={{margin: '20px', marginTop: '0px'}}>
                
                <h3>Top Creators</h3>
        
            </Row>
            <CreatorGrid></CreatorGrid>
            
        </Container>

  
        
    )
}

export default LandingScreen2