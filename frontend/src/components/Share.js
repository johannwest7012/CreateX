import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listCreators } from '../actions/creatorActions.js'



function Share({ share }) {
  const dispatch = useDispatch()

  console.log("ID: " + share.creator)

  const creatorList = useSelector(state => state.creatorList)
  const {error, loading, creators} = creatorList

  const creator_obj = creators.find(creator => creator._id === share.creator)

  // useEffect(() => {
  //   if(creators.length === 0){
  //       dispatch(listCreators())
  //   }
  // }, [dispatch, creators])

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