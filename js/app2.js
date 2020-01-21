const version = '0.3.3',
    secciones = [],
    data = {},
    rutas = {
        bandas: 'data/bandas.json'
    };

console.log(`Iniciando v${version}`);

// Rellenar secciones
let sectionels = Array.from( document.getElementsByTagName('section') );

sectionels.forEach(el => secciones.push(el.id));

// Crear sección de bandas
createBandas();

// Routeo
goToRoute(location.hash.substr(1));

window.addEventListener('load', _ => {
    
});

//// Routeo: eventos
window.addEventListener("popstate", _ => {
    // console.log('Pop');

    let ubicacion   = location.hash.substr(1),
        saneada     = returnSection(ubicacion);

    if (ubicacion != saneada)
    {
        console.log(`Cambiando ${ubicacion} por ${saneada}`);
        goToRoute(saneada);
    } else
    {
        // Verificar si no está intentando entrar al perfil de una banda
        if (saneada.indexOf('bandas/') > -1)
        {
            let banda = saneada.split('/')[1],
                elem = document.getElementById(saneada);

            if (!elem) crearPerfil(banda);
        }
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

async function crearPerfil (banda)
{
    // Estoy intentando entrar a la página de una banda
    // Construir la página
    const nueva = document.getElementById('tplInnerBanda').content.cloneNode(true),
        seccion = nueva.querySelector('section'),
        logo    = nueva.querySelector('img'),
        body    = nueva.querySelector('.article-principal'),
        video   = nueva.querySelector('.article-video'),
        social  = nueva.querySelector('.article-social');

    // Asignarle el id a la nueva sección que se está creando
    seccion.id = `bandas/${banda}`;

    // Ponerle la foto de los pibes de fondo de pantalla
    seccion.style.backgroundImage = `url(img/bandas/${banda}/foto.png)`;

    logo.src = `img/bandas/${banda}/logo.png`;

    logo.alt = data.bandas[banda].name;

    // Cuerpo de la descripción
    let parrafo = document.createElement('p');
    parrafo.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    body.appendChild(parrafo);

    document.body.appendChild(nueva);

    // Recargar la sección a través del hash
    location.hash = location.hash;
}

async function createBandas ()
{
    const seccion = document.querySelector('#bandas article'),
        tpl     = document.getElementById('tplBanda'),
        bandas  = await fetch(rutas.bandas).then(res => res.json());
    
    console.log(bandas);

    // Poner en la data general
    data.bandas = bandas.reduce((obj, val) => {
        obj[val.id] = val;

        return obj;
    }, {});

    bandas.forEach(banda => {
        // Clonar template
        let clon    = tpl.content.cloneNode(true),
            img     = clon.querySelector('img'),
            anchor  = clon.querySelector('a');
            // caption = clon.querySelector('figcaption');

        // Link
        anchor.href = `#bandas/${banda.id}`;

        // Logo de la banda
        img.src = `img/bandas/${banda.id}/logo.png`;
        img.alt = banda.name;

        // Poner nombre
        // caption.innerHTML = banda.name;

        // Append a la sección
        seccion.appendChild(clon);

        // Crear registro en las secciones disponibles
        secciones.push(`bandas/${banda.id}`);
    });
}