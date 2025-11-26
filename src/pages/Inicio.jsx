import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '../assets/styles/inicio.css';

const Inicio = () => {
  return (
    <>
      <div className="contenido-principal fondo d-flex justify-content-center align-items-center vh-100">
        <div
          className="card shadow-lg text-white text-center p-4"
          style={{
            maxWidth: '650px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            background: 'rgba(33, 37, 41, 0.9)', // fondo sólido oscuro
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="card-body">
            <h1 className="card-title mb-3">✨ Bienvenido a WallsVerse✨</h1>
            <p className="card-text fs-5">
              Explora un universo lleno de emociones, batallas épicas y personajes inolvidables.
            </p>
            <p className="card-text">
              🚀 Naruto, 👹 Kimetsu no Yaiba, 🧙‍♂️ Jujutsu Kaisen, 🗡️ Solo Leveling y más...
            </p>
            <a href="/vengadores" className="btn btn-danger mt-3">
              Explorar animes
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inicio;
