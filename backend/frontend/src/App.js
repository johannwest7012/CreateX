// import logo from './logo.svg';

//import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
//import Header from './components/Header'
//import Footer from './components/Footer'

import LandingScreen from './screens/LandingScreen'
import LandingScreen2 from './screens/LandingScreen2'
import LandingScreen3 from './screens/LandingScreen3'


import HomeScreen from './screens/HomeScreen';

import ChartCreatorScreen from './screens/ChartCreatorScreen';
import CreatorScreen from './screens/CreatorScreen';


import FavoritesScreen from './screens/FavoritesScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import PortfolioScreen from './screens/PortfolioScreen'


import PolicyScreen from './screens/PolicyScreen'





import ParticleBackground from './components/ParticleBackground';
//import ParticleBackgroundDark from './components/ParticleBackgroundDark';

import WithNav from './components/WithNav'
import WithoutNav from './components/WithoutNav';
import history from './history';



function App() {

  return (
    <Router history={history}>
          <Routes>
            <Route element={<WithoutNav />}>
                <Route path='/' element={<ParticleBackground />} exact />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/landing' element={<LandingScreen3 />} exact />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/home' element={<HomeScreen />} exact />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/login' element={<LoginScreen />} />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/register' element={<RegisterScreen />} />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/profile' element={<ProfileScreen />} />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/creator/:id' element={<ChartCreatorScreen animate={true} />} />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/favorites/:id?' element={<FavoritesScreen animate={true} />} />
            </Route>
            <Route element={<WithNav />}>
                <Route path='/portfolio' element={<PortfolioScreen />} exact />
            </Route>

            <Route element={<WithNav />}>
                <Route path='/policy' element={<PolicyScreen />} exact />
            </Route>
            
          </Routes>
    </Router>
    
  );
}

export default App;
