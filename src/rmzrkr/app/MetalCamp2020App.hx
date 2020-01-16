package rmzrkr.app;

import js.Browser;

class MetalCamp2020App
{
    static var app: MetalCamp2020App;
    static var secciones: Array<String> = [];
    var version = '0.4';

    public function new ()
    {
        trace('Iniciando v${this.version}');

        // Verificar que el routeo es correcto
        var seccion = Browser.location.hash.length > 0 ?
            Browser.location.hash.substr(1) :
            'inicio';

        goToRoute(seccion);

        // BANDAS: Cargar datos y construír sección
        var xhr = new haxe.Http('data/bandas.json');

        xhr.onData = function (banddata)
        {
            trace('Cargué todo');
            trace(banddata);
        }

        xhr.request();

        // ACTIVIDADES: Construir sección
        
    }

    function goToRoute (seccion: String)
    {
        seccion = returnSection(seccion);

        js.Browser.location.replace('#${ seccion }');
    }

    function returnSection (seccion: String): String
    {
        var filtrado = secciones.filter((s) -> s == seccion);
        seccion  = filtrado.length > 0 ? seccion : 'inicio';

        return seccion;
    }

    static public function main ()
    {
        // Obtener los objetos section
        // e inicializar router
        var els = Browser.document.getElementsByTagName('section');

        for (seccion in els)
        {
            secciones.push(seccion.id);
        }

        app = new MetalCamp2020App();
    }
}