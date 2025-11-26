import { BrowserRouter ,Routes, Route} from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Error from './Error';
import Inicio from './Inicio';
import Login from './Login';
import Registro from './Registro';
import Vengadores from './Vengadores';
import Guardianes from './Guardianes';
import Xmen from './Xmen';
import Usuarios from './Usuarios';
import Informacion from './Informacion';
import RutasPrivadas from '../routes/RutasPrivadas';
import RutasPublicas from '../routes/RutasPublicas';



function App() {
  return (
        <BrowserRouter basename="/Oscar">
          <Nav />
            <Routes >
                <Route path="/" element={<RutasPrivadas> <Inicio /> </RutasPrivadas>} />
                <Route path="/registro" element={<RutasPublicas> <Registro /> </RutasPublicas>} />
                <Route path="/login" element={<RutasPublicas> <Login /> </RutasPublicas>} />
                <Route path="/vengadores" element={<RutasPrivadas> <Vengadores /> </RutasPrivadas>} />
                <Route path="/guardianes" element={<RutasPrivadas> <Guardianes /> </RutasPrivadas>} />
                <Route path="/xmen" element={<RutasPrivadas> <Xmen /> </RutasPrivadas>} />
                <Route path="/usuarios" element={<RutasPrivadas> <Usuarios /> </RutasPrivadas>} />
                <Route path="/informacion" element={<RutasPrivadas> <Informacion /> </RutasPrivadas>} />
                <Route path="#" element={<Error />} />
            </Routes>
          <Footer />
        </BrowserRouter>
  );
}

export default App;