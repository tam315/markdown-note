# Git

## NOTE

\[ \] means that it can be omitted.

## Setup

```sh
git config --global user.name "my name"
git config --global user.email "my-address@goes.here"
git config --global core.editor "notepad++"
git config --list

git config --global -e # to use specific editor

cat ~/.gitconfig
```

## 4 Areas

- Working Directory
- Staging Area
- Repository (.git folder)
- Remote

## Basics

### Words

- `HEAD` means last commit.

### Add

```sh
git add . # all files under current directory
git add -A # all files
git add -u # all files except new files (u = update)

git add . --dry-run # pre test
```

### Commit

```sh
git commit -m "commit message"
git commit -am "commit message" # add & commit at same time
```

### List tracked files

```sh
git ls-files
```

### Unstage

```sh
git reset [HEAD]
git reset [HEAD] somefile.txt
```

### Discard changes

```sh
git checkout [--] somefile.txt
```

### Move files

```sh
git mv file1.txt file2.txt
```

the difference between `mv` and`git move` is that `git mv` automatically stages files.

### Delete files

```sh
git rm file1.txt
```

### Show logs

```sh
git log --all --oneline --graph --decorate
git log f8vk34...1ffai8
git log somefile.txt
git log --follow somefile.txt # follow rename

git show fi8vd2
```

## Alias

```sh
git config --global alias.h "log --oneline"
git h # => equiv with "git log --oneline"
```

or edit .gitconfig directly.

## Merge & Diff tools

```sh
git config --global merge.tool p4merge
git config --global mergetool.p4merge.path "C:/Program Files/Perforce/p4merge.exe"

git config --global diff.tool p4merge
git config --global difftool.p4merge.path "C:/Program Files/Perforce/p4merge.exe"
```

## Compare

All followning `diff`s can be replaced with `difftool`

### HEAD vs Working directory

```sh
git diff
```

### HEAD vs Staging area

```sh
git diff --staged
#or
git diff --cached
```

### HEAD vs All changes(staged & unstaged)

```sh
git diff HEAD
```

### HEAD vs Specific commit

```sh
git diff fj38v87 [HEAD]
git diff HEAD^ [HEAD]
```

Note that args should be lined old commit first. Otherwise result will be opposite.

### Between specific commits

```sh
git diff fj38v87 ow8vjq3
```

### Between branches

```sh
git diff mainbranch topicbranch
```

### Local vs Remote

```sh
git diff origin/remoteBranchName localBranchName
```

## Branch & Marge

### Show branch

```sh
git branch -a # show remote & local branch
```

### Create branch

```sh
git branch somename
git checkout -b somename # create branch & checkout
```

### Rename branch

```sh
git branch -m some_name some_new_name
```

### Delete branch

```sh
git branch -d somename
git branch -D somename # delete unmerged branch
```

### Merge branch (Fast-Forward)

```sh
git merge somebranch
```

### Merge branch (Non Fast-Forward)

```sh
git merge --no-ff somebranch
git merge --no-ff somebranch -m "commit message"
```

### Resolving conflicts

```sh
git merge somebranch
git mergetool
git commit -m "this is merge commit message"
```

.orig file (backup file) may be created when resolving conflicts. remove or ignore it.

## Rebase

### from local branch

```sh
git checkout -b myfeature
git rebase master
git mergetool # if there is conflicts, fix it
git rebase --continue
git rebase --abort # cancel rebasing
```

### from remote branch

```sh
git fetch origin/master
git checkout master
git rebase origin/master

# or

git pull --rebase origin master
```

## Stash

```sh
git stash [save "this is stash message"]
git stash -u # include new file (u = untracked)
git stash list
git stash show [stash@{0}]
git stash apply [stash@{0}]
git stash drop # delete most recent stash
git stash drop [stash@{0}]
git stash clear # delete all stash
git stash pop [stash@{0}] # apply & drop at a time

git stash branch newbranchname
# Create a new branch with name `newbranchname`
# Checkout to new branch
# Apply & drop a stash
```

## Tag

Tags can be used as params.

```sh
git diff mytag HEAD
```

### Lightweight tag

```sh
git tag mytag
git tag mytag 870f3c
git tag mytag 870f3c -f # force to move tag point
git tag --list
git tag --delete mytag
```

### Annotated tag

Annotated tag has Tagger(author), date&time, tag message.
Rest is same as lightweight tag.

```sh
git tag -a v-1.0
git show v-1.0
```

### push tags to remote

```sh
git push origin master --tags # transfer all tag
git push origin :mytag # delete tag
```

## Reflog

```sh
git reflog
git reset 357vef9 # back to this reflog
```
