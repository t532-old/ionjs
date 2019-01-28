npm install
cd packages
foreach ($filename in dir -dir -name) { # For every compiled file
    if ($filename -ne '.') { # If not .. or .
        if ($filename -ne '..') {
            cd $filename
            npm install
            cd ..
        }
    }
}
cd ..