


import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import Creator from '../components/Creator'
import CreatorCard from '../components/CreatorCard'
import Loader from '../components/Loader'
import Message from '../components/Message'


import { listCreators } from '../actions/creatorActions.js'
import history from '../history'


// const cardsData = [
//   { title: "Card 1", content: "This is card 1 content" },
//   { title: "Card 2", content: "This is card 2 content" },
//   { title: "Card 3", content: "This is card 3 content" },
// ];

// const CreatorCardsRow2 = () => {
//   return (
//     <div style={{ display: "flex", gap: "20px" }}>
//       {cardsData.map((card) => (
        
//       ))}
//     </div>
//   );
// };



// export default CreatorCardsRow2



function CreatorCardsRow2() {
    const dispatch = useDispatch()
    const creatorList = useSelector(state => state.creatorList)
    const {error, loading, creators} = creatorList


    useEffect(()=> {
        dispatch(listCreators())
        
    }, [dispatch])


  

    return (
        
        <div>
            <Container>
                {loading ? <Loader />
                    : error ? <Message variant='danger'>{error}</Message>
                    : <Row>
                    {creators.slice(0,4).map(creator => (
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

export default CreatorCardsRow2