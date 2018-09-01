# Lerna

[[toc]]

## Setup

```bash
yarn global add lerna
lerna init
```

lerna.json

```json
{
  "lerna": "2.11.0",
  "packages": ["packages/*"],
  "version": "0.0.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

package.json

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

```bash
yarn
lerna bootstrap
```

## command

### run command for each packages

```bash
lerna exec yarn test # with console
lerna run test # with NO console
```

## 参考

[One vs. many — Why we moved from multiple git repos to a monorepo and how we set it up](https://hackernoon.com/one-vs-many-why-we-moved-from-multiple-git-repos-to-a-monorepo-and-how-we-set-it-up-f4abb0cfe469)
