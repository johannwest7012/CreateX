import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom';

import Creator from '../components/Creator'
import CreatorCard from '../components/CreatorCard'
import Loader from '../components/Loader'
import Message from '../components/Message'


import { listCreators } from '../actions/creatorActions.js'
import history from '../history'


function HomeScreen() {
    const dispatch = useDispatch()
    const creatorList = useSelector(state => state.creatorList)
    const {error, loading, creators} = creatorList

    let keyword = history.location.search
    console.log('keyword: ' + keyword)

    const [searchParams, setSearchParams] = useSearchParams();
    var keyword2 = searchParams.get("keyword"); 

    if (keyword2 === null) { 
        keyword2 = ''
    }
    keyword2 = '?keyword=' + keyword2
    console.log('keyword2: ' + keyword2)



    useEffect(()=> {
        dispatch(listCreators(keyword2))
        
    }, [dispatch, keyword])


  

    return (
        
        <div>
            <Container>
                <br></br>
                <h1>Creators</h1>
                {loading ? <Loader />
                    : error ? <Message variant='danger'>{error}</Message>
                    : <Row>
                    {creators.map(creator => (
                        <Col key={creator._id} sm={12} md={6} lg={4} xl={3}> 
                            <CreatorCard creator={creator}/>
                        </Col>
                        ))}
                    </Row>
                }
            </Container>
        </div>
       
    )
}

export default HomeScreen