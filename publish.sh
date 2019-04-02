VERSION=$(npm version patch)
VERSION=$(echo $VERSION | cut -c 2-)

git add .
git commit -m"Published via script"
git push

npm publish

apm publish --tag $VERSION
