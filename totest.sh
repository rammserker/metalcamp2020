#!/bin/sh
DESTINATION="../cassetteuy.github.io/test/metalcamp2020/";
cp -u index.html $DESTINATION;
cp -u -r js $DESTINATION/js;
cp -u -r css $DESTINATION/css;
cp -u -r img $DESTINATION/img;

cd $DESTINATION;
git add *;
cd -;
