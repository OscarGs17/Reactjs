import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '../assets/styles/personajes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from '../components/Card';
import Formulario from '../components/Formulario';
import { useState, useEffect, useContext } from 'react';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import Contexto from '../context/Contexto';

const Xmen = () => {
    const [contenido, setContenido] = useState([]);
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
    const { usuario } = useContext(Contexto);

    useEffect(() => {
        fetch("http://localhost:3000/xmen")
            .then(respuesta => respuesta.json())
            .then(respuesta => setContenido(respuesta))
            .catch(() => console.log('Error al consumir la api'));
    }, []);

    const abrirModal = () => {
        const modal = new Modal(document.getElementById('modalAgregar'));
        modal.show();
    };

    const manejarSeleccion = (alias) => {
        fetch(`http://localhost:3000/xmen/${alias}`)
            .then(res => res.json())
            .then(datos => {
                setPersonajeSeleccionado(datos);
                const modal = new Modal(document.getElementById('modalEditar'));
                modal.show();
            })
            .catch(err => console.log('Error al traer personaje individual', err));
    };

    const eliminarPersonaje = (alias) => {
        Swal.fire({
            title: "¿Estás seguro de eliminar este personaje?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3000/xmen/eliminar/${alias}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Autorizacion': 'Back ' + usuario.token,
                    }
                })
                    .then(res => res.json())
                    .then(async datos => {
                        await Swal.fire({
                            title: datos.msj,
                            icon: datos.icon
                        });
                    })
                    .catch(err => console.log('Error al eliminar personaje', err));
            }
        });
    };

    return (
        <div className='contenido-personajes bg-galaxia-morado min-vh-100 py-5'>
            <div className='container'>
                <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-lightning-charge-fill text-info fs-1 me-3"></i>
                        <h1 className='fw-bold'>Dragon ball</h1>
                    </div>
                    {
                        usuario.user_data.rol === 1 && (
                            <button onClick={abrirModal} type="button" className="btn btn-outline-info" title="Agregar nuevo personaje">
                                <i className="bi bi-person-bounding-box fs-3"></i>
                            </button>
                        )
                    }
                </div>

                <div className="row g-4 justify-content-center">
                    {contenido.map(personaje => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={personaje._id}>
                            <Card 
                                personaje={personaje}
                                onEditar={manejarSeleccion}
                                onEliminar={eliminarPersonaje}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Editar */}
            <div className="modal fade" id="modalEditar" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content bg-dark text-white border-warning">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="modalLabel">Editar personaje</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Formulario 
                                datos={personajeSeleccionado}
                                grupo="xmen"
                                leyenda="Editar personaje"
                                color="bbtn btn-outline-warning"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Agregar */}
            <div className="modal fade" id="modalAgregar" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content bg-dark text-white border-info">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="modalLabel">Agregar personaje</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Formulario 
                                grupo="xmen"
                                leyenda="Agregar Personaje"
                                color="btn btn-outline-info"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Xmen;
