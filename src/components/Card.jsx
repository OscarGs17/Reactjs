import '../assets/styles/card.css';
import { useContext, useState } from 'react';
import Contexto from '../context/Contexto';
import ReactMarkdown from 'react-markdown';

const Card = ({ personaje, onEditar, onEliminar }) => {
    const { usuario } = useContext(Contexto);
    const [hover, setHover] = useState(false);

    const estiloZoom = {
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hover ? '0 8px 16px rgba(0,0,0,0.3)' : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    };

    return (
        <div 
            className="card-container" 
            style={estiloZoom}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="card-inner">
                {/* Mantengo las dos caras para que el diseño no cambie, 
                    pero oculto la trasera con inline style */}
                
                {/* Cara frontal */}
                <div className="card-front card">
                    <div className='img'>
                        <img 
                            src={`http://localhost:3000/uploads/${personaje.url}`} 
                            className="card-img-top" 
                            alt={personaje.alias} 
                            style={{ width: "100%", height: "350px", objectFit: "cover" }} 
                        />
                    </div>
                    <div className="card-body">
                        <h5 className="card-title mb-3">{personaje.alias}</h5>
                        <p className="card-text"><b>Nombre:</b> {personaje.nombre}</p>
                        <p className="card-text"><b>Poder:</b> {personaje.poder}</p>
                        <p className="card-text"><b>Categoria:</b> {personaje.categoria}</p>
                        <p className="card-text"><b>Nivel de amenaza:</b> {personaje.nivel_amenaza}</p>
                    </div>
                    {usuario.user_data.rol === 1 && (
                        <div className="card-footer">
                            <button className="btn btn-warning me-2 btn-card" onClick={() => onEditar(personaje.alias)}>Editar</button>
                            <button className="btn btn-danger btn-card" onClick={() => onEliminar(personaje.alias)}>Eliminar</button>
                        </div>
                    )}
                </div>

                {/* Cara trasera ocultada */}
                <div className="card-back card" style={{ display: 'none' }}>
                    <div className="card-body">
                        <h5 className="card-title pb-3">Historia</h5>
                        <ReactMarkdown>{personaje.biografia}</ReactMarkdown>
                        <p className="text-danger">(Haz clic para volver)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
