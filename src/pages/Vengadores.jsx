import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '../assets/styles/personajes.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from '../components/Card';
import Formulario from '../components/Formulario';
import React, { useState, useEffect, useContext } from 'react';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import Contexto from '../context/Contexto';

const Vengadores = () => {
    const [contenido, setContenido] = useState([]);
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
    const { usuario } = useContext(Contexto);

    useEffect(() => {
        fetch("http://localhost:3000/vengadores")
            .then(res => res.json())
            .then(res => setContenido(res))
            .catch(err => console.log('Error al consumir la API', err));
    }, []);

    const abrirModal = () => {
        const modal = new Modal(document.getElementById('modalAgregar'));
        modal.show();
    };

    const manejarSeleccion = (alias) => {
        fetch(`http://localhost:3000/vengadores/${alias}`)
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
                fetch(`http://localhost:3000/vengadores/eliminar/${alias}`, {
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center text-white">
                        <i className="bi bi-shield-shaded text-danger fs-1 me-3"></i>
                        <h1 className='fw-bold'>Solo leveling</h1>
                    </div>
                    {
                        usuario.user_data.rol === 1 && (
                            <button onClick={abrirModal} className="btn btn-outline-light" data-bs-toggle="tooltip" title="Agregar nuevo personaje">
                                <i className="bi bi-person-plus-fill fs-4"></i>
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
            <div className="modal fade" id="modalEditar" tabIndex="-1" aria-labelledby="modalLabelEditar" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-dark text-white border-light">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="modalLabelEditar">Editar personaje</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Formulario 
                                datos={personajeSeleccionado} 
                                grupo="vengadores" 
                                leyenda='Editar personaje' 
                                color='btn btn-warning' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Agregar */}
            <div className="modal fade" id="modalAgregar" tabIndex="-1" aria-labelledby="modalLabelAgregar" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-dark text-white border-info">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="modalLabelAgregar">Agregar personaje</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Formulario 
                                grupo="vengadores" 
                                leyenda='Agregar personaje' 
                                color='btn btn-info' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vengadores;
