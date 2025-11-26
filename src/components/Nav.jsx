import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Contexto from "../context/Contexto";
import "../assets/styles/navar.css";
import logo from "../assets/img/sl1.png";

import NavDropdown from "react-bootstrap/NavDropdown";

const Nav = () => {
  const { cerrar_sesion, usuario } = useContext(Contexto);
  const navegacion = useNavigate();

  const manejar_estado = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/manejar_estado/${usuario?.user_data?.usuario || ""}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: 2 }),
        }
      );
      const datos = await res.json();
      console.log(datos);
    } catch (error) {
      console.error("Error al actualizar estado del usuario:", error);
    }
  };

  const finalizar_sesion = async () => {
    if (usuario?.user_data?.usuario) {
      await manejar_estado();
    }
    cerrar_sesion();
    navegacion("/login", { replace: true });
  };

  // Links públicos y privados
  const linksPublicos = (
    <>
      <NavLink className="m-3 link" to="/login">
        Login
      </NavLink>
      <NavLink className="m-3 link" to="/registro">
        Registro
      </NavLink>
    </>
  );

  const linksPrivados = (
    <>
      <NavLink className="m-3 link" to="/">
        Inicio
      </NavLink>
      <NavLink className="m-3 link" to="/vengadores">
        Solo Leveling
      </NavLink>
      <NavLink className="m-3 link" to="/guardianes">
        Guardianes
      </NavLink>
      <NavLink className="m-3 link" to="/xmen">
        Dragon Ball
      </NavLink>
      {usuario?.user_data?.rol === 1 && (
        <NavLink className="m-3 link" to="/usuarios">
          Usuarios
        </NavLink>
      )}
    </>
  );

  return (
    <nav
      className="navar d-flex justify-content-between align-items-center px-4"
      style={{ background: "#ed1d24" }}
    >
      <div className="d-flex align-items-center flex-grow-1">
        <div className="contenedor-img me-4">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "50px", cursor: "pointer" }}
          />
        </div>
        <div className="contenedor-nav d-flex align-items-center">
          {usuario ? linksPrivados : linksPublicos}
        </div>
      </div>

      {usuario && (
        <div className="d-flex align-items-center">
          <i
            className="bi bi-person-fill fs-3 p-2 icono"
            aria-hidden="true"
          ></i>
          <NavDropdown
            className="link"
            title={usuario?.user_data?.usuario || "Usuario"}
            id="basic-nav-dropdown"
            menuVariant="light"
          >
            <NavDropdown.Item onClick={finalizar_sesion}>
              Cerrar sesión
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="/informacion"
              style={{ textDecoration: "none", color: "black" }}
            >
              Información
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      )}
    </nav>
  );
};

export default Nav;
