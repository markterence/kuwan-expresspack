# RELEASING

This document contains snippets and instructions for releasing.
Content may change over time.

- Make sure you have committed and pushed all your changes to the `main` branch.
- Make sure the build is successful.
- Make sure to update the version in `package.json` files in each package.
- Make sure to update the changelog files in each package.

Dry-run publish:
```
pnpm publish --access public --no-git-checks --tag [tagname] --publish-branch main --dry-run
```

Actual publish with npm tag (e.g. `latest`, `beta`, `alpha`, `next`):

```
pnpm publish --access public --no-git-checks --tag [tagname] --publish-branch main

# Example with tag "next", user will install it with:
npm install my-package@next
```

Publish without tag:

```
pnpm publish --access public --no-git-checks --publish-branch main
```
