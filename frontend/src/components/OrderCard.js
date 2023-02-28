import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Order({ order }) {
    return (
      <Card className='my-3 p-3 rounded'>
          <Card.Body>
             
              <Card.Title as='div'>
                  My Orders

              </Card.Title>
                  <h5>Order #32 bought at $38.75</h5>
                  <h5> Order Processed: True</h5>
          </Card.Body>
      </Card>
    )
  }

  export default Order