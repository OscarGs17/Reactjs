import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '../assets/styles/informacion.css';
import { useContext } from 'react';
import FormularioUsuario from '../components/FormularioUsuario';
import Contexto from '../context/Contexto';

const Informacion = () => {
    const { usuario } = useContext(Contexto);

    return (
        <div className="contenido-info bg-galaxia-morado min-vh-100 text-white d-flex align-items-center">
            <div className='container'>
                <div className="row pt-5 justify-content-center">
                    <div className="col-md-6 col-lg-4 contenedor-form">
                        <FormularioUsuario
                            datos={usuario.user_data}
                            leyenda='Actualizar Datos'
                            color='btn btn-outline-warning'
                            btn_info={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Informacion;
