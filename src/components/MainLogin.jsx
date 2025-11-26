import { useContext } from 'react';
import Contexto from '../context/Contexto';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const MainLogin = () => {
  const { login } = useContext(Contexto);
  const navegacion = useNavigate();

  const validaciones = {
    usuario: {
      required: "El campo usuario es requerido",
      pattern: {
        value: /^[a-zA-Z0-9]+$/,
        message: "El usuario solo puede contener letras y números"
      }
    },
    password: {
      required: "El campo password es requerido",
      pattern: {
        value: /^[a-zA-Z0-9]+$/,
        message: "La contraseña solo puede contener letras y números"
      }
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm();

  const manejar_estado = (usuario) => {
    fetch(`http://localhost:3000/manejar_estado/${usuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: 1 }),
    })
      .then(res => res.json())
      .then(datos => {
        console.log(datos);
      })
      .catch(err => console.log('Error al traer al usuario', err));
  };

  const onsubmit = (data) => {
    fetch("http://localhost:3000/login", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        usuario: data.usuario,
        password: data.password
      })
    })
      .then(respuesta => respuesta.json())
      .then(async respuesta => {
        if (respuesta.token) {
          await Swal.fire({
            title: respuesta.msj,
            icon: respuesta.icon
          });
          await login(respuesta);
          navegacion("/", { replace: true });
          manejar_estado(respuesta.user_data.usuario);
        } else {
          await Swal.fire({
            title: respuesta.msj,
            icon: respuesta.icon
          });
        }
      })
      .catch(error => {
        console.log("Se ha generado un error en el servidor", error);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-4"></div>
        <div className="col-8 contenedor-principal-form">
          <Form onSubmit={handleSubmit(onsubmit)} className='contenedor-formulario'>
            <Row className="mb-5 row-formulario">
              <h2 className='text-center mb-5'>Bienvenido, ingresa tus datos</h2>

              <Form.Group as={Col} md="4" controlId="usuarioInput" className='group'>
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  {...register("usuario", validaciones.usuario)}
                  type="text"
                  placeholder="Nombre de usuario"
                  defaultValue=""
                />
                {errors.usuario && <div className="text-danger">{errors.usuario.message}</div>}
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="passwordInput" className='group'>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  {...register("password", validaciones.password)}
                  type="password"
                  placeholder="Ingrese su contraseña"
                  defaultValue=""
                />
                {errors.password && <div className="text-danger">{errors.password.message}</div>}
              </Form.Group>
            </Row>

            <Row className='row-formulario'>
              <Button type="submit" className='w-50 btn btn-danger boton-ingresar' id='btn-ingresar'>
                Ingresar
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default MainLogin;
