#!/bin/sh
# DESTINATION="../cassetteuy.github.io/test/metalcamp2020/";
DESTINATION="../carnivalfestpaysandu.github.io/";
cp -u index.html $DESTINATION;
cp -u -r js ${DESTINATION};
cp -u -r css ${DESTINATION};
cp -u -r img ${DESTINATION};
cp -u -r fonts ${DESTINATION};
cp -u -r data ${DESTINATION};

cd $DESTINATION;
git add *;
cd -;
