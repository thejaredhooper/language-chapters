PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g'
  | tr -d '[[:space:]]')

npm version patch \
  && git push \
  && npm publish \
  && apm publish --tag $PACKAGE_VERSION
