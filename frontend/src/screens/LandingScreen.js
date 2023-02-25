import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button, Image } from 'react-bootstrap'
import Creator from '../components/Creator'
import Loader from '../components/Loader'
import Message from '../components/Message'
import heroimg from './images/createxheroimg1.png'

// import { listCreators } from '../actions/creatorActions'

// className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}
function LandingScreen() {

    

    return (
        
        <Container className="hero-section intro" style={{ height: '100vh' }}>
            <Container className="hero-wrapper">
            {/* <Image src={heroimg}> */}
                <Row className="justify-content-center align-items-center" style={{ height: '50%' }}>
                    <Col className="justify-content-center">
                        <h1 className='display'>Invest In</h1>
                        <h1 className='display _3'>Creators</h1>
                        <div>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.</p>
                        </div>
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
            {/* </Image> */}
            </Container>
        </Container>
        
    )
}

export default LandingScreen