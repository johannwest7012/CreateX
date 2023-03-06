import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'


function Order({ order }) {

    const creatorList = useSelector(state => state.creatorList)
    const {error, loading, creators} = creatorList

    const creator_obj = creators.find(creator => creator._id === order.creator)

    const processed = "Processing"
    if (order.is_fulfilled){
        processed = "Order fulfilled"
    }
    return (
      <Card className='my-3 p-3 rounded'>
          <Card.Body>
             
              <Card.Title as='div'>
                  Order ID : {order._id}

              </Card.Title>
                  <h6>Type: {order.order_type}</h6>
                  <h6>Creator: {creator_obj.name}</h6>
                  <h6>Price: {order.price}</h6>
                  <h6>Order Status: {processed}</h6>
          </Card.Body>
      </Card>
    )
  }

  export default Order