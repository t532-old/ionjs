if ($env:APPVEYOR_REPO_BRANCH -eq "master" -and !$env:APPVEYOR_PULL_REQUEST_HEAD_REPO_BRANCH) {
    # Build
    npm run docs:build
    # Clone and Edit
    cd ..
    git clone "https://github.com/ionjs-dev/ionjs-dev.github.io.git" docs # Clone
    foreach ($filename in dir -name "ionjs/docs/.vuepress/dist") { # For every compiled file
        if ($filename -ne '.') { # If not .. or .
            if ($filename -ne '..') {
                if (test-path "docs/$filename") { rm -r -fo "docs/$filename" } # Delete Exsisting Version
                mv "ionjs/docs/.vuepress/dist/$filename" "docs/" # Move File
            }
        }
    }
    # Commit and Push
    cd "docs"
    git config user.email "trustq@qq.com" # Config Email
    git config user.name "t532 via AppVeyor CI" # Config Name
    git add * # Stage
    git commit -m "AppVeyor CI Automated Deploy" # Commit
    git remote add origin-gh-pages "https://$env:GITHUB_TOKEN@github.com/ionjs-dev/ionjs-dev.github.io.git" # Add Remote
    git push --quiet --set-upstream origin-gh-pages master # Push
    # Prevent Side-effects
    cd ../ionjs
}
