import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import Creator from '../components/Creator'
import Loader from '../components/Loader'
import Message from '../components/Message'


import { listCreators } from '../actions/creatorActions'


function HomeScreen() {
    const dispatch = useDispatch()
    const creatorList = useSelector(state => state.creatorList)
    const {error, loading, creators} = creatorList

    useEffect(()=> {
        dispatch(listCreators())
        
    }, [dispatch])

  

    return (
        
        <div>
            <Container>
                <h1>Latest Stocks</h1>
                {loading ? <Loader />
                    : error ? <Message variant='danger'>{error}</Message>
                    : <Row>
                    {creators.map(creator => (
                        <Col key={creator._id}sm={12} md={6} lg={4} xl={3}> 
                            <Creator creator={creator}/>
                        </Col>
                        ))}
                    </Row>
                }
            </Container>
        </div>
       
    )
}

export default HomeScreen