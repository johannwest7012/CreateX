
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import particlesConfigDark from "./config/particles-config-dark";
import {Card, Row, Col, Image, Button, Container, Stack} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import myLogo from './CreateXlogo-white.svg'

const ParticleBackgroundDark = () => {

    const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);


    return (
    <div>
    <Particles params={particlesConfigDark} init={particlesInit} loaded={particlesLoaded}/>
        <Row>
            <Col></Col>
            <Col>
                <Stack gap={0}>
                    <Image width='700' src={myLogo}/>
                    <Link to='/home' className='btn btn-light my-3'>Enter</Link>
                </Stack>
            </Col>
            <Col></Col>
        </Row>

    </div>
    )
}

export default ParticleBackgroundDark