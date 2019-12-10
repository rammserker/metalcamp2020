package rmzrkr.app;

import js.Browser;

class MetalCamp2020App
{
    static var app: MetalCamp2020App;
    static var secciones: Array<String> = [];
    var version = '0.3';

    public function new ()
    {
        trace('Iniciando v${this.version}');

        var seccion = Browser.location.hash.length > 0 ?
            Browser.location.hash.substr(1) :
            'inicio';

        goToRoute(seccion);
    }

    function goToRoute (seccion: String)
    {
        var filtrado = secciones.filter((s) -> s == seccion);
        seccion  = filtrado.length > 0 ? seccion : 'inicio';

        js.Browser.location.replace('#${ seccion }');
    }

    static public function main ()
    {
        // Obtener los objetos section
        var els = Browser.document.getElementsByTagName('section');

        for (seccion in els)
        {
            secciones.push(seccion.id);
        }

        app = new MetalCamp2020App();
    }
}