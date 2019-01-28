npm run build
cd packages
foreach ($filename in dir -dir -name) { # For every compiled file
    if ($filename -ne '.') { # If not .. or .
        if ($filename -ne '..') {
            cd $filename
            npm run build
            cd ..
        }
    }
}
cd ..