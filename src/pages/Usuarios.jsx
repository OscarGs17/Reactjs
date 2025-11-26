import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '../assets/styles/usuario.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect, useContext } from 'react';
import Contexto from '../context/Contexto';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import FormularioUsuario from '../components/FormularioUsuario';

const Usuarios = () => {
    const [contenido, setContenido] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState([]);
    const { usuario } = useContext(Contexto);

    useEffect(() => {
        fetch(`http://localhost:3000/usuarios/${usuario.user_data.usuario}`)
            .then(respuesta => respuesta.json())
            .then(respuesta => setContenido(respuesta))
            .catch(error => console.log('Error al consumir la api', error));
    }, [contenido, usuario]);

    const abrirModal = () => {
        const modal = new Modal(document.getElementById('usuarioAgregar'));
        modal.show();
    };

    const seleccionarUsuario = (usuario) => {
        fetch(`http://localhost:3000/usuario/${usuario}`)
            .then(res => res.json())
            .then(datos => {
                setUsuarioSeleccionado(datos);
                const modal = new Modal(document.getElementById('usuarioEditar'));
                modal.show();
            })
            .catch(err => console.log('Error al traer usuario individual', err));
    };

    const eliminarUsuario = (usuario) => {
        Swal.fire({
            title: "¿Estás seguro de eliminar este usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3000/eliminar_usuario/${usuario}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(async datos => {
                        await Swal.fire({
                            title: datos.msj,
                            icon: datos.icon
                        });
                    })
                    .catch(err => console.log('Error al eliminar usuario', err));
            }
        });
    };

    return (
        <>
            <div className='contenido-usuarios bg-galaxia-morado min-vh-100 py-5 text-white'>
                <div className='d-flex justify-content-center align-items-center mb-5'>
                    <h1 className='me-3'>Usuarios registrados</h1>
                    <button onClick={abrirModal} type="button" className="btn btn-outline-info btn-personaje">
                        <i className="bi bi-person-bounding-box fs-3"></i>
                    </button>
                </div>
                <div className='container'>
                    <table className="table table-striped table-bordered text-white">
                        <thead className="tabla-header">
                            <tr>
                                <td>Usuario</td>
                                <td>Rol</td>
                                <td>Cuenta</td>
                                <td>Estado</td>
                                <td>Acciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {contenido.map(usuario => (
                                <tr key={usuario._id}>
                                    <td>{usuario.usuario}</td>
                                    <td>{usuario.rol === 1 ? 'Administrador' : 'Usuario'}</td>
                                    <td>{usuario.cuenta === 1 ? 'Habilitada' : 'Deshabilitada'}</td>
                                    <td>{usuario.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                                    <td>
                                        <button className='btn btn-warning me-3' onClick={() => seleccionarUsuario(usuario.usuario)}>Editar</button>
                                        <button className='btn btn-danger' onClick={() => eliminarUsuario(usuario.usuario)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Editar */}
            <div className="modal fade" id="usuarioEditar" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header header-editar">
                            <h5 className="modal-title" id="exampleModalLabel">Editar usuario</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body body-editar">
                            <FormularioUsuario
                                datos={usuarioSeleccionado}
                                leyenda='Editar usuario'
                                color='btn btn-outline-warning' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Agregar */}
            <div className="modal fade" id="usuarioAgregar" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header header-agregar">
                            <h5 className="modal-title" id="exampleModalLabel">Agregar usuario</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body body-agregar">
                            <FormularioUsuario
                                leyenda='Agregar usuario'
                                color='btn btn-outline-info' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Usuarios;
