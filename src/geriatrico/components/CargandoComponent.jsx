import '../../css/cargando.css'
export const CargandoComponent = () => {
    return (
        <>
            <div id="contenedor">
                <div className="contenedor-loader">
                    <div className="rueda"></div>
                </div>
                <div className="cargando">Cargando...</div>
            </div>
        </>
    )
}
