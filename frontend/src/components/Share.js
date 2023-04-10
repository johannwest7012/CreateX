import React from 'react'
import { Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


function Share({ share }) {
  console.log("ID: " + share._id)

  const creatorList = useSelector(state => state.creatorList)
  const {error, loading, creators} = creatorList

  const creator_obj = creators.find(creator => creator._id === share.creator)

  return (
    <Card className='my-3 p-3 rounded'>
        <Card.Body>
           
            <Card.Title as='div'>
                <h5>{creator_obj.name}</h5>
                <h5>Creator ID {share.creator}</h5>
                <h5>Share ID {share._id}</h5>
            </Card.Title>
    
        </Card.Body>
    </Card>
  )
}

export default Share