import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useForm } from 'react-hook-form';  
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 

const MainRegistro = () => {
  
  const navegacion = useNavigate();
  
  const validaciones = {
    "usuario": {
      required:"El campo usuario es requerido",
      pattern: {
        value: /^[a-zA-Z0-9]+$/,
        message: "El usuario solo puede contener letras y números"
      }
    },
    "password": {
      required:"El campo password es requerido",
      pattern: {
        value: /^[a-zA-Z0-9]+$/,
        message: "La contraseña solo puede contener letras y números"
      }
    }
  }
  const {register,handleSubmit,formState: {errors}} = useForm();

  const onsubmit = (data) => {
    fetch("http://localhost:3000/registro/2", {
      headers: {"Content-Type":"application/json"},
      method: "post",
      body: JSON.stringify({
        "usuario":data.usuario,
        "password":data.password
    })}).then(respuesta => respuesta.json())
    .then(async respuesta => {
        await Swal.fire({
            title: respuesta.msj,
            icon: respuesta.icon
        });
        if (respuesta.status) {
          navegacion("/login",{replace:true});
        }
    }).catch(error => {
      console.log("Se ha generado un error en el servidor ",error);
    })
  }

  return (
    <>
      <div className="row">
        <div className="col-8 contenedor-principal-form">
          <Form onSubmit={handleSubmit(onsubmit)} className='contenedor-formulario-registro'>
            <Row className="mb-5 row-formulario">
              <h2 className='text-center mb-5'>Ingresa  los siguientes datos</h2>
              <Form.Group as={Col} md="4" controlId="validationCustom01" className='group'>
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  {...register("usuario",validaciones.usuario)}
                  type="text"
                  placeholder="Nombre de usuario"
                  defaultValue=""
                />
                {errors.usuario && <div className="text-danger">{errors.usuario.message}</div>}
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom01" className='group'>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  {...register("password",validaciones.password)}
                  type="password"
                  placeholder="Ingrese su contraseña"
                  defaultValue=""
                />
                {errors.password && <div className="text-danger">{errors.password.message}</div>}
              </Form.Group>
            </Row>

            <Row className='row-formulario'>
              <Button type="submit" className='w-50 btn btn-danger boton-ingresar' id='btn-registro'>Registrarse</Button>
            </Row> 

          </Form>
        </div>
        <div className="col-4">
        </div>
      </div>
    </>
  );
}

export default MainRegistro;
