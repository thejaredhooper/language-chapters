VERSION=$(npm version patch)
VERSION=$(echo $VERSION | cut -c 1-)

git add .
git commit -m"Published Version Through Script: $(echo $VERSION)"
git push

npm publish

apm publish --tag $VERSION
