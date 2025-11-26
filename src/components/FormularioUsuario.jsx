import { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import Contexto from '../context/Contexto';
import { useNavigate } from "react-router-dom";

const FormularioUsuario = ({ datos, leyenda, color, btn_info }) => {
  const [validar, setValidar] = useState(false);
  const {usuario, cerrar_sesion} = useContext(Contexto);
  const navegacion = useNavigate();
  const [formulario, setFormulario] = useState({
    usuario: '',
    password: '',
    rol: '',
    cuenta: ''
  });

  useEffect(() => {
    if (datos) {
      setFormulario({
        usuario: datos.usuario || '',
        password: '',
        rol: datos.rol || '',
        cuenta: datos.cuenta || ''
      });
    }
  }, [datos]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const agregar_usuario = () => {
    fetch(`http://localhost:3000/registro/${usuario.user_data.rol}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formulario),
    }).then(res => res.json())
      .then(async datos => {
        await Swal.fire({
          title: datos.msj,
          icon: datos.icon
        });
        let modal = Modal.getInstance(document.getElementById('usuarioAgregar')); 
        modal.hide();
        setFormulario({
          usuario: '',
          password: '',
          rol: '',
          cuenta: ''
        });
        setValidar(false);
      })
      .catch(err => console.log('Error al traer personaje individual', err));
  }

  const editar_personaje = () => {
    fetch(`http://localhost:3000/actualizar_usuario/${datos.usuario}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formulario),
    }).then(res => res.json())
      .then(async datos => {
        await Swal.fire({
          title: datos.msj,
          icon: datos.icon
        });

        if (btn_info) {
          navegacion("/login",{replace:true})
          cerrar_sesion();
        } else {
          let modal = Modal.getInstance(document.getElementById('usuarioEditar')); 
          modal.hide();
          setValidar(false);
        }

      })
      .catch(err => console.log('Error al traer al usuario', err));
  }

  const handleSubmit = (event) => {
    setValidar(true);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else {

      if(datos){
        event.preventDefault();
        editar_personaje();
      } else {
        event.preventDefault();
        agregar_usuario();
      }
    }

  };

  return (
    <Form noValidate validated={validar} onSubmit={handleSubmit} className='text-white' id='formulario'>
      <Row>
      
        <Col as={Col} md={12}>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nombre de usuario"
                name="usuario"
                value={formulario.usuario}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el nombre de usuario.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña del usuario"
                name="password"
                value={formulario.password}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          {
            usuario.user_data.rol === 1 ?
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustom04">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select aria-label="Default select example"
                  required
                  placeholder="Rol del usuario"
                  name="rol"
                  value={formulario.rol}
                  onChange={manejarCambio}
                  >
                  <option value="" disabled>Rol del usuario</option>
                  <option value={1}>Administrador</option>
                  <option value={2}>Usuario</option>
                  </Form.Select>
                  <Form.Control.Feedback>Ok!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                      Por favor ingresa el rol del usuario.
                  </Form.Control.Feedback>
              </Form.Group>
            </Row>
            : ""
          }
          {
            usuario.user_data.rol === 1 ?
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustom04">
                  <Form.Label>Cuenta</Form.Label>
                  <Form.Select aria-label="Default select example"
                  required
                  placeholder="Estado del usuario"
                  name="cuenta"
                  value={formulario.cuenta}
                  onChange={manejarCambio}
                  >
                  <option value="" disabled>Estado del usuario</option>
                  <option value={1}>Habilitada</option>
                  <option value={2}>Desabilitada</option>
                  </Form.Select>
                  <Form.Control.Feedback>Ok!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                      Por favor ingresa el estado del usuario.
                  </Form.Control.Feedback>
              </Form.Group>
            </Row>
            :""
          } 
          <Row className='mb-3 d-flex justify-content-end'>
            <Button variant="none" type="submit" className={`${color} w-50 me-3`}>
              {leyenda}
            </Button>
          </Row>

        </Col>

      </Row>
      
    </Form>
  );
};

export default FormularioUsuario;