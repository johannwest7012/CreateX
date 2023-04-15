import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import Share from '../components/Share'
import Loader from '../components/Loader'
import Message from '../components/Message'

import history from '../history'


import { getUserDetails } from '../actions/userActions'
import { getUserShares } from '../actions/userActions'
import { listCreators } from '../actions/creatorActions.js'

import { USER_UPDATE_PROFILE_RESET } from'../constants/userConstants'



function PortfolioScreen() {
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const shareList = useSelector(state => state.userShares)
    const shares = shareList.shares
    const shares_success = shareList.success
    const shares_loading = shareList.loading
    const shares_error = shareList.error


    useEffect(() => {
        if(!userInfo){
            history.push('#/login')
        }else{
            dispatch(getUserShares('shares'))
        }
    }, [dispatch, history, userInfo])

  

    return (
        
        <div>
            <Container>
                <br></br>
                <h1>Portfolio</h1>
                {shares_loading ? <Loader />
                    : shares_error ? <Message variant='danger'>{shares_error}</Message>
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