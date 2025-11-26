

import React, { useReducer } from 'react';
import Contexto from './Contexto';
import MiReducer from './MiReducer';
import types from './types';

const inicio = () => {
    try {
        const sesion = JSON.parse(localStorage.getItem("usuario"));
        if (sesion && new Date(sesion.expira) > new Date()) {
            return { logueado: true, usuario: sesion };
        } else {
            localStorage.removeItem("usuario");
            return { logueado: false, usuario: null };
        }
    } catch (e) {
        // Por si el JSON está mal formado o hay error
        localStorage.removeItem("usuario");
        return { logueado: false, usuario: null };
    }
};

const Provider = ({ children }) => {
    const [logeado, dispatch] = useReducer(MiReducer, {}, inicio);

    const login = (datos) => {
        // Añadimos una hora de expiración (puedes ajustar el tiempo si quieres)
        const datosConExpira = {
            ...datos,
            expira: new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hora
        };

        const action = {
            type: types.login,
            usuario: datosConExpira
        };

        localStorage.setItem("usuario", JSON.stringify(datosConExpira));
        dispatch(action);
    };

    const cerrar_sesion = () => {
        const action = {
            type: types.logout,
            usuario: null
        };
        localStorage.removeItem("usuario");
        dispatch(action);
    };

    return (
        <Contexto.Provider value={{ ...logeado, login, cerrar_sesion }}>
            {children}
        </Contexto.Provider>
    );
};

export default Provider;
