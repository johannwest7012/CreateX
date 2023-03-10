import React, { useState, useEffect } from 'react'
import { Link, redirect, useParams, useLocation} from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector} from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'

import { login } from '../actions/userActions'

import history from '../history'


function LoginScreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    let location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/'

    // user login is in store.js
    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    // an authenticated user should not see the login page 
    // they do not see the login page, but currently
    // it does not seem to redirect them to the page they were on 
    // before they logged in 
    useEffect(() => {
        if(userInfo){
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
    <FormContainer>
        <h1>Sign In</h1>

        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                >

                </Form.Control>
            </Form.Group>


            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                >

                </Form.Control>
            </Form.Group>

            <Button 
                type='submit' 
                variant='primary'
               >
                Sign In
            </Button>
        </Form>

        <Row className='py-3'>
            <Col>
                New User? 
                <Link 
                to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                Register
                </Link>
            </Col>

        </Row>
    </FormContainer>
    )
}

export default LoginScreen