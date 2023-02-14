import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function Share({ share }) {
  return (
    <Card className='my-3 p-3 rounded'>
        <Card.Body>
           
            <Card.Title as='div'>
                <h5>Creator ID {share.creator}</h5>
                <h5>Share ID {share._id}</h5>
            </Card.Title>
    
        </Card.Body>
    </Card>
  )
}

export default Share