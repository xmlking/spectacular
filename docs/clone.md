# Clone

follow [this guide](https://gist.github.com/0xjac/85097472043b697ab57ba1b1c7530274) to  **create a private fork of a public repository**

## Setup

> If you want, add the original repo as remote to fetch (potential) future changes. Make sure you also disable push on the remote (as you are not allowed to push to it anyway).

```shell
git remote add upstream https://github.com/xmlking/spectacular.git
git remote set-url --push upstream DISABLE
```

You can list all your remotes with `git remote -v`. You should see:

```
origin  https://github.com/<my-org>/<my-private-repo>.git (fetch)
origin  https://github.com/<my-org>/<my-private-repo>.git (push)
upstream        https://github.com/xmlking/spectacular.git (fetch)
upstream        DISABLE (push)
```

When you push, do so on `origin` with `git push origin`.

When you want to pull changes from `upstream` you can just fetch the remote and **merge** on top of your work.

```shell
git fetch upstream
git merge upstream/main --no-ff
# then, fix any merge confects 
git merge --continue
git push
```

**(OR)** When you want to pull changes from `upstream` you can just fetch the remote and **rebase** on top of your work.

```shell
git fetch upstream
git rebase upstream/main
```
