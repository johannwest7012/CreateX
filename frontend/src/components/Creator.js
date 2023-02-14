import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function Creator({ creator }) {
  return (
    <Card className='my-3 p-3 rounded'>
        <Link to={`/creator/${creator._id}`}>
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
                ${creator.price}
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Creator