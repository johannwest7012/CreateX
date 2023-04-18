import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'

import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listCreators } from '../actions/creatorActions.js'


function Order({ order }) {

    console.log(order)
    var processed = "Processing"
    var color = "orange"
    if (order.isFulfilled === true){
        processed = "Order fulfilled"
        color = "green"
    }
    return (
      <Card className='my-3 p-3 rounded'>
          <Card.Body>
             
              <Card.Title as='div'>
                  Order ID : {order._id}

              </Card.Title>
                  <h6>Type: {order.order_type}</h6>
                  <h6>Creator: {order.creator}</h6>
                  <h6>Price: {order.price}</h6>
                  <h6 style={{'color':color}}>Order Status: {processed}</h6>
          </Card.Body>
      </Card>
    )
  }

  export default Order