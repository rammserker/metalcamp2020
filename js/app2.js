const version = '0.2',
    secciones = [];

console.log(`Iniciando v${version}`);

// Rellenar secciones
let sectionels = Array.from( document.getElementsByTagName('section') );

sectionels.forEach(el => secciones.push(el.id));

// Routeo
// let seccion = location.hash.length > 0 ? location.hash.substr(1) : 'inicio';
goToRoute(location.hash.substr(1));

//// Routeo: eventos
window.addEventListener("popstate", _ => {
    console.log('Pop');

    let ubicacion   = location.hash.substr(1),
        saneada     = returnSection(ubicacion);

    if (ubicacion != saneada)
    {
        console.log(`Cambiando ${ubicacion} por ${saneada}`);
        goToRoute(saneada);
    }
});

// Funciones
function returnSection (seccion)
{
    let filtrado = secciones.filter(s => s == seccion);
    seccion = filtrado.length > 0 ? seccion : 'inicio';

    return seccion;
}

function goToRoute (seccion)
{
    seccion = returnSection(seccion);

    location.replace(`#${ seccion }`);
}

