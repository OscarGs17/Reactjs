import { useState, useEffect, useContext } from 'react';
import Contexto from '../context/Contexto';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

const Formulario = ({ datos, grupo, leyenda, color }) => {
  const [validar, setValidar] = useState(false);
  const {usuario} = useContext(Contexto);
  const [formulario, setFormulario] = useState({
    url: '',
    alias: '',
    nombre: '',
    poder: '',
    categoria: '',
    nivel_amenaza: '',
    biografia: ''
  });

  useEffect(() => {
    if (datos) {
      setFormulario({
        url: datos.url || '',
        alias: datos.alias || '',
        nombre: datos.nombre || '',
        poder: datos.poder || '',
        categoria: datos.categoria || '',
        nivel_amenaza: datos.nivel_amenaza || '',
        biografia: datos.biografia || ''
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

 
  const agregar_personaje = () => {
  // Paso 1: pedir al backend que descargue la imagen
    fetch('http://localhost:3000/archivo/descargar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Autorizacion': 'Back ' + usuario.token,
      },
      body: JSON.stringify({ url: formulario.url })
    })
      .then(res => res.json())
      .then(async resultado => {
        if (resultado.estatus !== 'correcto') {
          await Swal.fire({ title: resultado.msj, icon: 'error' });
          return;
        }

        // Paso 2: Reemplazar url por el nombre del archivo guardado
        const datosAInsertar = {
          ...formulario,
          url: resultado.archivo
        };

        // Paso 3: Insertar el personaje con la nueva URL
        fetch(`http://localhost:3000/${grupo}/insercion/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Autorizacion': 'Back ' + usuario.token,
          },
          body: JSON.stringify(datosAInsertar),
        })
          .then(res => res.json())
          .then(async datos => {
            await Swal.fire({
              title: datos.msj,
              icon: datos.icon
            });

            let modal = Modal.getInstance(document.getElementById('modalAgregar'));
            modal.hide();

            setFormulario({
              url: '',
              alias: '',
              nombre: '',
              poder: '',
              categoria: '',
              nivel_amenaza: '',
              biografia: ''
            });

            setValidar(false);
          })
          .catch(err => {
            console.log('Error al insertar personaje', err);
            Swal.fire({ title: 'Error al insertar personaje', icon: 'error' });
          });
      })
      .catch(err => {
        console.log('Error al descargar imagen', err);
        Swal.fire({ title: 'Error al descargar imagen', icon: 'error' });
      });
  };


  const editar_personaje = () => {
    fetch(`http://localhost:3000/${grupo}/actualizar/${datos.alias}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Autorizacion':'Back '+usuario.token,
      },
      body: JSON.stringify(formulario),
    }).then(res => res.json())
      .then(async datos => {
        await Swal.fire({
          title: datos.msj,
          icon: datos.icon
        });
        let modal = Modal.getInstance(document.getElementById('modalEditar')); 
        modal.hide();
        setValidar(false);
      })
      .catch(err => console.log('Error al traer personaje individual', err));
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
        agregar_personaje();
      }
    }

  };

  return (
    <Form noValidate validated={validar} onSubmit={handleSubmit} className='text-white' id='formulario'>
      <Row>
      
        <Col as={Col} md={4}>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Biografia</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Agrega la biografia o historia del personaje"
                name="biografia"
                value={formulario.biografia}
                onChange={manejarCambio}
                as="textarea" rows={8}
              />
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el alias.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Col>

        <Col as={Col} md={8}>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Url</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Url de la imagen"
                name="url"
                value={formulario.url}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el alias.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <Form.Label>Alias</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Alias del personaje"
                name="alias"
                value={formulario.alias}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el alias.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom02">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nombre del personaje"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un nombre.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom03">
              <Form.Label>Poder</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Poder del personaje"
                name="poder"
                value={formulario.poder}
                onChange={manejarCambio}
              />
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa su poder.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom04">
              <Form.Label>Categoría</Form.Label>
              <Form.Select aria-label="Default select example"
                required
                placeholder="Nivel de amenaza"
                name="categoria"
                value={formulario.categoria}
                onChange={manejarCambio}
                >
                <option value="" disabled>Categorias</option>
                <option value="cosmico">Cosmico</option>
                <option value="tecnologico">Tecnologico</option>
                <option value="mutante">Mutante</option>
                <option value="peleador">Peleador</option>
                <option value="cientifico">Cientifico</option>
                <option value="mistico">Mistico</option>
              </Form.Select>
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa una categoría.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom05">
              <Form.Label>Nivel de amenaza</Form.Label>
              <Form.Select aria-label="Default select example"
                required
                placeholder="Nivel de amenaza"
                name="nivel_amenaza"
                value={formulario.nivel_amenaza}
                onChange={manejarCambio}
                >
                <option value="" disabled>Niveles de amenaza</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </Form.Select>
              <Form.Control.Feedback>Ok!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa su nivel de amenaza.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className='mb-3 d-flex justify-content-end'>
            <Button variant="none" type="submit" className={`${color} w-25 me-3`}>
              {leyenda}
            </Button>
          </Row>

        </Col>

      </Row>
      
    </Form>
  );
};

export default Formulario;
