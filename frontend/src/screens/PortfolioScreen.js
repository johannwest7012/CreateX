import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import Share from '../components/Share'
import Loader from '../components/Loader'
import Message from '../components/Message'

import history from '../history'



import { getUserShares } from '../actions/userActions'
import { listCreators } from '../actions/creatorActions.js'


function PortfolioScreen() {
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const shareList = useSelector(state => state.userShares)
    const {error, loading, shares} = shareList

    useEffect(() => {
        if(!userInfo){
            history.push('#/login')
        }else{
            dispatch(getUserShares('shares'))
            dispatch(listCreators())
        }
    }, [dispatch, history, userInfo])
  

    return (
        
        <div>
            <Container>
                <br></br>
                <h1>Portfolio</h1>
                {loading ? <Loader />
                    : error ? <Message variant='danger'>{error}</Message>
                    : <Row>
                    {shares.map(share => (
                        <Col key={share._id} sm={12} md={6} lg={4} xl={3}> 
                            <Share share={share}/>
                        </Col>
                        ))}
                    </Row>
                }
            </Container>
        </div>
       
    )
}

export default PortfolioScreen