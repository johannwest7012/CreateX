import React, {useState} from 'react'
import {Button, Col, Form} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import history from '../history'


function SearchBox() {

    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => { 
        e.preventDefault()
        if (keyword){
            history.push(`#/home/?keyword=${keyword}`)
            window.location.reload()
        }
        else {
            history.push(history.location.pathname)
            window.location.reload()
        }
    }
    return (
        <Form onSubmit={submitHandler} style={{display:'flex'}}>
            <Form.Control
                type = 'text'
                name = 'q'
                onChange = {(e) => setKeyword(e.target.value)}
                className =  'mr-sm-2 ml-sm-5 rounded-1'
            >
            </Form.Control>
            <Col className='p-1'></Col>
            <Button
                type = 'submit'
                variant='primary'
                className='p-2'
        
            >
                Search
            </Button>
            <Col className='p-1'></Col>


        </Form>
    )
}

export default SearchBox