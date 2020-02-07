#!/bin/sh
# DESTINATION="../cassetteuy.github.io/test/metalcamp2020/";
DESTINATION="../carnivalfestpaysandu.github.io/";

echo "Copiando archivos a ${DESTINATION}...";
cp -u index.html $DESTINATION;
cp -u favicon.png $DESTINATION;
# cp -u -r js ${DESTINATION};
cp -u -r css ${DESTINATION};
cp -u -r img ${DESTINATION};
cp -u -r fonts ${DESTINATION};
cp -u -r data ${DESTINATION};
echo "> LISTO!";

# Compresión del js para producción
echo "Comprimiendo JS...";
uglifyjs js/app2.js --compress --mangle --ecma 8 -o ${DESTINATION}js/app2.js;
echo "> LISTO!";

echo "Agregando archivos para commit...";
cd $DESTINATION;
git add --all;
cd -;
echo "> LISTO!";