#!/bin/bash

# cd to the script's dir
cd "$(dirname "$0")"

# For both minified and full version
for conditionize in ./jquery.conditionize2.*js; do
    echo "===== ${conditionize} ====="
    # For each version of jQuery
    for jqueryfile in $(find ./node_modules/jquery* -name "jquery.min.js" -type f); do

        # Get pretty jQuery version from the package path
        jqueryversion=$(echo "$jqueryfile" | cut -d"/" -f 3 | cut -b 7- | sed -r "s/_/./g")
        echo "----- jQuery v${jqueryversion} -----"

        # Make tmp dir and move jquery and conditionize files to it
        mkdir ./test/tmp
        cp $conditionize ./test/tmp/conditionize2.js
        cp $jqueryfile ./test/tmp/jquery.js

        # Run all tests
        for testfile in test/*.html; do
            ./node_modules/.bin/node-qunit-phantomjs "$testfile"
        done

        # Clear the tmp dir to not affect the next iteration
        rm -rf ./test/tmp
    done
done
