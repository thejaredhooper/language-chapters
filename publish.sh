PACKAGE_VERSION=$(npm version patch)

npm version patch \
  && git push \
  && npm publish \
  && apm publish --tag $PACKAGE_VERSION
