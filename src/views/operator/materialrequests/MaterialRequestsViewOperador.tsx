import { MaterialRequestForm } from "./MaterialRequestsForm";

const MaterialRequestsViewOperador = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center md:text-start mb-3" >Solicitud de materiales</h1>
            {/* Aquí insertamos el formulario */}
            <MaterialRequestForm />  {/* Este es el formulario que se mostrará en la página */}
        </div>
    );
}

export default MaterialRequestsViewOperador