const version = '0.3.62',
    secciones = [],
    data = {},
    rutas = {
        bandas: 'data/bandas.json'
    },
    datetimeinicio = new Date('2020-02-07T19:00:00-03:00'),
    contador = document.querySelector('.cuenta');

console.log(`Iniciando v${version}`);

// Rellenar secciones
let sectionels = Array.from( document.getElementsByTagName('section') );

sectionels.forEach(el => secciones.push(el.id));

// Crear sección de bandas
createBandas();

// Routeo
goToRoute(location.hash.substr(1));

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
    window.scrollTo(0,0);
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

        menuel.removeEventListener(ocultarMenu);
    }

    menuel.addEventListener('click', ocultarMenu);
});

/*
// Arreglo de fondo en chromium movil
const mob = ((i, a) => /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(i) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(i.substr(0, 4)))(navigator.userAgent || navigator.vendor || window.opera);

if (mob)
{
    // Arreglo de fondo para chromium movil
    console.log('Arreglar');

    if (outerHeight / outerWidth >= 0)
}
*/