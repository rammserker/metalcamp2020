/* App Carnival Fest Paysandú Metal Camp 2020   */
/* @author  Maximiliano "rammserker" Fernández  */

const debug = true,
    version = '0.1',
    trace = !debug ? console.log : _ => _;

trace(`** Iniciando app (versión ${version})`);

function testID (str)
{
    try {
        const el = document.querySelector(str);
        return !!el;
    } catch (e)
    {
        return false;
    }
}

if (window.location.hash.length == 0 || !testID(window.location.hash))
{
    window.location = '#inicio';
}