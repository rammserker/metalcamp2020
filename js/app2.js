const version = '0.4',
    secciones = [],
    data = {},
    rutas = {
        bandas: 'data/bandas.json'
    },
    datetimeinicio = new Date('2020-02-07T19:00:00-03:00'),
    contador = document.querySelector('.cuenta');

console.log(`Iniciando v${version}`);
console.log('¿Querés saber cómo está hecha esta página? Estudiá todo lo que quieras, pariente. Sin frameworks');

// Rellenar secciones
let sectionels = Array.from( document.getElementsByTagName('section') );

sectionels.forEach(el => secciones.push(el.id));

// Crear sección de bandas
createBandas();

// Verificar que la ruta pasada sea correcta
let ubicacion = location.hash.substr(1),
    saneada   = returnSection(ubicacion);

if (ubicacion != saneada)
{
    console.log(`Cambiando ${ubicacion} por ${saneada}`);
    goToRoute(saneada);
} else
{
    // Verificar si no está intentando entrar al perfil de una banda
    if (saneada.indexOf('bandas/') > -1)
    {
        // debugger
        let banda = saneada.split('/')[1],
            elem = document.getElementById(saneada);

        if (!elem) crearPerfil(banda);
    }
}

// Routeo
window.addEventListener('load', _ => {
    updateContador();
});

//// Routeo: eventos
window.addEventListener("popstate", _ => {
    // console.log('Evento de pop');

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
            // debugger
            let banda = saneada.split('/')[1],
                elem = document.getElementById(saneada);

            if (!elem) crearPerfil(banda);
        }
    }

    // Para que quede siempre al top
    window.scroll({
        top: 0,
        left: 0,
        behaviour: 'smooth'
    });
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
        title   = nueva.querySelector('h3'),
        // logo    = nueva.querySelector('img'),
        body    = nueva.querySelector('.article-principal'),
        video   = nueva.querySelector('.article-video'),
        social  = nueva.querySelector('.article-social');

    // Asignarle el id a la nueva sección que se está creando
    seccion.id = `bandas/${banda}`;

    // Ponerle la foto de los pibes de fondo de pantalla
    seccion.style.backgroundImage = `url(img/bandas/${banda}/foto.png)`;

    // Poner el logo como título de la sección
    title.innerHTML     = data.bandas[banda].name;
    title.style.content = `url(img/bandas/${banda}/logo.png)`;

    // Poner el nombre de la banda como título, debajo del logo
    body.querySelector('h2').innerHTML = data.bandas[banda].name;

    // Cargar datos
    const banddata = await fetch(`data/${banda}/profile.json`).then(res => res.json());

    // Redes sociales
    if (banddata.social != null)
    {
        banddata.social.forEach(url => {
            const ared  = document.createElement('a');
            ared.href   = url;
            ared.target = "_blank";

            if (url.indexOf('facebook') > -1)
            {
                ared.innerHTML = '<i class="icon-facebook"></i>Facebook';
                ared.alt = 'Facebook';
            } else if (url.indexOf('instagram') > -1)
            {
                ared.innerHTML = '<i class="icon-instagram"></i>Instagram';
                ared.alt = 'Instagram';
            } else if (url.indexOf('bandcamp') > -1)
            {
                ared.innerHTML = '<i class="icon-bandcamp"></i>Bandcamp';
                ared.alt = 'Bandcamp';
            } else if (url.indexOf('soundclou') > -1)
            {
                ared.innerHTML = '<i class="icon-soundcloud"></i>Soundcloud';
                ared.alt = 'Soundcloud';
            } else if (url.indexOf('youtube') > -1)
            {
                ared.innerHTML = '<i class="icon-youtube"></i>YouTube';
                ared.alt = 'YouTube';
            } else if (url.indexOf('spoti') > -1)
            {
                ared.innerHTML = '<i class="icon-spotify"></i>Spotify';
                ared.alt = 'Spotify';
            } else
            {
                ared.innerHTML = '<i class="icon-home"></i>Sitio oficial';
                ared.alt = 'Sitio oficial';
            };

            social.appendChild(ared);
        });
    }

    // Cuerpo de la descripción
    banddata.description.split('\n').forEach(parrafo => {
        const p = document.createElement('p');
        p.innerHTML = parrafo;

        body.appendChild(p);    
    });

    // Agregar como último parrafo la fecha en que estarán tocando
    let horario = document.createElement('p'),
        fecha   = new Date(data.bandas[banda].event);

    horario.innerHTML = `${data.bandas[banda].name} estará tocando en el Carnival Fest Paysandú el día
    <a href="#programa" alt="Ver actividades"><time datetime="${data.bandas[banda].event}">${fecha.toLocaleString('es-UY', {weekday: 'long', day: 'numeric'})} a las ${fecha.toLocaleString('es-UY', {hour: 'numeric', minute: 'numeric'})}</time></a>
    ¡No te lo pierdas!`;

    body.appendChild(horario);

    // Video de la banda
    if (banddata.video != null && banddata.video.indexOf("facebook") == -1)
    {
        video.innerHTML = `<iframe
        width="560"
        height="315"
        src="https://www.youtube-nocookie.com/embed/${banddata.video}?rel=0"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`;    
    } else
    {
        video.classList.add('profile-no-video');
    }

    // Agregar perfil a la página
    document.body.appendChild(nueva);

    // Recargar la sección a través del hash
    // Por problemas en chromiums debo engañar al sistema y hacer un cambio doble
    let mihash = location.hash;
    location.hash = '#inicio';
    location.hash = mihash;
}

async function createBandas ()
{
    const seccion = document.querySelector('#bandas article'),
        tpl     = document.getElementById('tplBanda'),
        bandas  = await fetch(rutas.bandas).then(res => res.json());

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

function updateContador ()
{
    let diff = new Date(datetimeinicio - Date.now());

    contador.innerHTML = `faltan <span>${diff.toLocaleString('es-UY', {day: '2-digit'})}</span> dias<time>${diff.toLocaleString('es-UY', {hour: 'numeric', minute: 'numeric', second: 'numeric'})}</time>`; // + ':' + diff.toLocaleString('es-UY', {hour: 'numeric', minute: 'numeric', second: 'numeric'});

    setTimeout(updateContador, 1000);
}

/// Gestión de menú móvil
const anvorgesa = document.querySelector('.icon-menu'),
    menuel = document.querySelector('nav');

anvorgesa.addEventListener('click', _ => {
    menuel.style.display = 'flex';

    function ocultarMenu (evt)
    {
        menuel.style.removeProperty('display');

        menuel.removeEventListener('click', ocultarMenu);
    }

    menuel.addEventListener('click', ocultarMenu);
});