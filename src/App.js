
import Header from './My Components/header'
import Carousel from './My Components/carousel'
import Titleforcards from './My Components/titleforcards'
import CardContainer from './My Components/cardcontainer'
import Footer from './My Components/footer'
import About from './My Components/about'
import Info from './My Components/info'
import Login from './My Components/login'
import Signup from './My Components/signup'
import Favorite from './My Components/favorite'
import './App.css';
  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={
            <>
          <Header/>
          <Carousel/>
          <Titleforcards/>
          <CardContainer/>
          <Footer/>
          </>}
          />
           <Route exact path='/about' element={<About />} />
           <Route path="/info/:title" element={<Info />} />
           <Route exact path='/signup' element={<Signup/>} />;
           <Route exact path='/login' element={<Login/>} />;
           <Route exact path='/favorite' element={<Favorite/>} />;
        </Routes>
      </Router>
    </>
  );
}

export default App;
