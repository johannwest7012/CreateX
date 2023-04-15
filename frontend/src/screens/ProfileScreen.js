import React, { useState, useEffect } from 'react'
// import { useLocation} from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector} from 'react-redux'

import Loader from '../components/Loader'
import Order from'../components/OrderCard'
import Message from '../components/Message'

import { getUserDetails, getUserOrderHistory, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from'../constants/userConstants'

import history from '../history'
import { listCreatorDetails, listCreators } from '../actions/creatorActions'

function ProfileScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [balance, setBalance] = useState('')

    const dispatch = useDispatch()
    
    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userOrderHistory = useSelector(state => state.userOrderHistory)
    const order_history = userOrderHistory.order_history
    const history_loading = userOrderHistory.loading
    const history_error = userOrderHistory.error
    const history_success = userOrderHistory.success


    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

  
    useEffect(() => {
        if(!userInfo){
            history.push('#/login')
            window.location.reload()
        }else{
            if(!user || !user.name || success){
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
                dispatch(listCreators(''))
                //dispatch(listCreatorDetails())
            }else{
                setName(user.name)
                setEmail(user.email)
                setBalance(user.balance)
            }
        }
        if(!order_history || !history_success){
            dispatch(getUserOrderHistory())
        }
    }, [dispatch, history, userInfo, user, success])

    const submitHandler = (e) => {
        e.preventDefault()

        // if passwords match, dispatch the updateUserProfile function 
        if(password !== confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(updateUserProfile({
                'id':user.id,
                'name':name,
                'email':email, 
                'password':password, 
            }))
            // setting message to blank after successful password match 
            setMessage('')
        }
        
    }

    return (
        <Container>
        <Row>
            <Col md={3}>
                <br></br>
                <h2>User Profile</h2>
                <h3>Balance : {balance}</h3>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader/>}

                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name' style={{marginBottom: '20px'}}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type='name'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >

                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email' style={{marginBottom: '20px'}}>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >

                        </Form.Control>
                    </Form.Group>


                    <Form.Group controlId='password' style={{marginBottom: '20px'}}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >

                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='passwordConfirm' style={{marginBottom: '20px'}}>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        >

                        </Form.Control>
                    </Form.Group>

                    <Button style={{marginTop: '20px'}} type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
                <Button style={{marginTop: '20px', marginBottom: '20px'}} type='submit' variant='primary'>
                        Delete Account
                </Button>

            </Col>
            <Col md={9}>
                <br></br>
                <h2>Order History</h2>

                {history_loading ? <Loader />
                    : history_error ? <Message variant='danger'>{history_error}</Message>
                    : <Row>
                        {order_history.map(order => (
                            <Col key={order.key} sm={12} md={6} lg={4} xl={3}> 
                                <Order order={order}/>
                            </Col>
                        ))}
                    </Row>
                }
                
                

            </Col>
        </Row>
        </Container>
    )
}

export default ProfileScreen