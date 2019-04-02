PACKAGE_VERSION=$(npm version patch)

git add .
git commit -m"Published via script"
git push
npm publish
apm publish --tag $PACKAGE_VERSION
