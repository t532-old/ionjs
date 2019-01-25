npm run docs:build # Build
git clone "https://github.com/ionjs-dev/docs" .docs # Clone
if (test-path .docs/docs) { rm -r -fo .docs/docs/ }
mv docs/.vuepress/dist/ .docs/docs/ # Edit
cd .docs # Change Path
git config user.email "2037246484@qq.com" # Config Email
git config user.name "t532 via AppVeyor CI" # Config Name
git add * # Stage
git commit -m "AppVeyor CI Automated Deploy" # Commit
git remote add origin-gh-pages "https://$env:GITHUB_TOKEN@github.com/ionjs-dev/docs.git" # Add Remote
git push --quiet --set-upstream origin-gh-pages master # Push
cd .. # Prevent Side-effects