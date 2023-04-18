import React from 'react'
import { Card, Row, Col, Container, Button, Image} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import history from '../history'


function CreatorCard({ creator }) {
    

    return (
    
    <Card className='my-3 p-3 rounded-1'>
        
       <Row>
            <Col>
                <Link to={`/creator/${creator._id}`}>
                    <Image style={{height: '100%', width: '100%' }} src={creator.image} roundedCircle />
                </Link>
            </Col>
            <Col>
                <Row><h6>{creator.name}</h6></Row>
                <Row><span style={{'fontSize': 'smaller'}}> </span></Row>
                <Row>
                    <h4 style={{'marginTop':'10px'}}> ${(creator.price).slice(0,-1)}</h4>
                </Row>        
            </Col>
        </Row>
      

        {/* <Link to={`/creator/${creator._id}`}>
            <Card.Img src={creator.image} />
        </Link>

        <Card.Body>
            <Link to={`/creator/${creator._id}`}>
                <Card.Title as='div'>
                    <strong>
                        {creator.name}
                    </strong>
                </Card.Title>
            </Link>
            <Card.Text as='div'>
                <div className='my-3'>
                    {creator.rating} Rating
                </div>
            </Card.Text>

            <Card.Text as='h3'>
                ${(creator.price).slice(0,-1)}
            </Card.Text>
        </Card.Body> */}
    </Card>
    )
}

export default CreatorCard