import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button, Image } from 'react-bootstrap'
import SimpleImageSlider from "react-simple-image-slider"

// Custom made components 
import Creator from '../components/Creator'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CoverPic from '../components/CoverPic'
import CreatorGrid from '../components/CreatorGrid'
import CreatorGrid2 from '../components/CreatorGrid2'
import CreatorCardsRow from '../components/CreatorCardsRow'
import CreatorCardsRow2 from '../components/CreatorCardsRow2'




import heroimg from './images/createxheroimg1.png'


// import { listCreators } from '../actions/creatorActions'

// className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}
function LandingScreen3() {

    const images = [
      
        { url: "https://createx-bucket.s3.us-east-2.amazonaws.com/brand/slideshow2.png" },

        
      ];
      

    

    return (
        <div style={{width: '100%'}}>
            
            <Container >
                <SimpleImageSlider
                    style={{marginTop: '50px', marginBottom: '30px'}}
                    width={1300}
                    height={504}
                    images={images}
                    showBullets={true}
                    showNavs={true}
                    autoPlay={true}
                    autoPlayDelay={7}
                />
             </Container>

            <Container                 
                style={{marginTop: '40px', marginBottom: '20px'}}
            >
                <h3>Recommended</h3>
                <CreatorCardsRow2/>
            </Container>

             <Container>
                <h3>Top Creators</h3>
                <CreatorGrid2/>
             </Container>
            


           
           
            
        </div>

  
        
    )
}

export default LandingScreen3