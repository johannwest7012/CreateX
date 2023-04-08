import React, { useState, useEffect } from 'react'
import { Link, redirect, useParams, useLocation} from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector} from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'

import { register } from '../actions/userActions'

import history from '../history'

function RegisterScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    let location = useLocation();
    //const redirect = location.search ? location.search.split('=')[1] : '/'

    
    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    // an authenticated user should not see the login page 
    // they do not see the login page, but currently
    // it does not seem to redirect them to the page they were on 
    // before they logged in 
    useEffect(() => {
        if(userInfo){
            history.push('/landing')
            window.location.reload()
        }
    }, [history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmPassword){
            setMessage('Passwords do not match')
        }else{
            dispatch(register(name, email, password))
        }
        
    }
    return (
        <FormContainer>

            <h1 style={{marginTop: '20px'}}>Sign Up</h1>
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
                        required
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
                        required
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' style={{marginBottom: '20px'}}>
                    Register
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    Returning User? 
                    <Link 
                    to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                    Login
                    </Link>
                </Col>

            </Row>

        </FormContainer>
    )
}

export default RegisterScreen