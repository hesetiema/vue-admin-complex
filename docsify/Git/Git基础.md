# Git 基础

- 命令行
  - pwd——（print work directory）显示出当前工作目录的绝对路径
  - mkdir myapp ——创建新目录
  - cd ../——回到根目录
  - cd ..——返回上一级目录
  - cd myapp——打开文件
- Workspace 工作区：就是你在电脑里能看到的目录。
- Index/Stage 暂存区：英文叫 stage, 或 index。一般存放在 ".git 目录下" 下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）。
- Repository 仓库区：工作区有一个隐藏目录.git，这个不算工作区，而是 Git 的版本库。
- Remote：远程仓库
- 创建 git 账号密码设置签名：
  - \$ git config --global user.name "username"
  - \$ git config --global user.email "username@gmail.com"
  - \$ git config --list #查看配置的信息
- 生成密码：
  - \$ ssh-keygen -t rsa -C “username@gmail.com”

## 1.创建版本库

- 当前目录新建一个 Git 代码库：`$ git init`
- 添加文件到 Git 仓库，分两步：
  - 添加当前目录的指定文件到暂存区：`$ git add <file1>...`
  - 提交暂存区的指定文件到仓库区：`$ git commit -m [message]`

## 2.版本回退

- 查看当前分支的版本历史：`$ git log --pretty=oneline`
- HEAD 指向当前 master，在版本的历史之间穿梭
  - `$ git reset --hard commit_id`
  - `$ git reset --hard HEAD^`或`$ git reset --hard HEAD~1`
- 查看当前分支的提交历史，以便确定要回到未来的哪个版本：`$ git reflog`
- 查看文件内容：`$ cat <file>`

## 3.工作区和暂存区

显示修改变更后（待暂存、待提交仓库）的文件：`$ git status`

## 4.管理修改

- 例：第一次修改 -> git add -> 第二次修改 -> git commit
  - 分析：Git 管理的是修改，当你用 git add 命令后，在工作区的第一次修改被放入暂存区，准备提交,但在工作区的第二次修改并没有放入暂存区，所以，git commit 只负责把暂存区的修改提交了，即第一次的修改被提交了，第二次的修改不会被提交。
  - 总结：每次修改，如果不用 git add 到暂存区，那就不会加入到 commit 中。
- 显示暂存区和工作区的差异：`$ git diff`

## 5.撤销修改

- 丢弃工作区的修改：`$ git checkout -- <file>`
  - checkout 其实是用版本库里的版本替换工作区的版本，无论工作区是修改还是删除，都可以“一键还原”。
- 撤销暂存区的暂存：`$ git reset HEAD <file>`
- 再丢弃工作区的修改：`$ git checkout -- <file>`

## 6.删除文件

- 删除工作区文件：`$ rm <file>`
- 撤销误删：`$ git checkout -- <file>`
  - 从来没有被添加到版本库就被删除的文件，是无法恢复的！
- 删除工作区文件，并且将这次删除放入暂存区：`$ git rm <file>`
- 提交暂存区到仓库区：`$ git commit -m "..."`

## 7.添加远程库

- 关联远程库：`$ git remote add origin git@server-name:path/repo-name.git`
  - 例如`$ git remote add origin git@github.com:hesetiema/learngit.git`
  - 远程库的名字就是 origin。可通过 \$ `git remote -v` 查看
- 第一次推送 master 分支到远程：`$ git push -u origin master`
  - 本地分支 master 与远程 master 关联
- 把本地 master 分支的最新修改推送至远程库：`$ git push origin master`
- 分布式版本系统的最大好处之一是在本地工作完全不需要考虑远程库的存在，也就是有没有联网都可以正常工作，当有网络的时候，再把本地提交推送一下就完成了同步。

## 8.从远程库克隆

要克隆一个仓库，首先必须知道仓库的地址，然后使用 git clone 命令克隆：

- `$ git clone git@server-name:path/repo-name.git`
- Git 支持多种协议，包括 https，但通过 ssh 支持的原生 git 协议速度最快。

## 9.分支管理

### 9.1 分支分类

- 分支：每次提交，Git 都把它们串成一条时间线，这条时间线就是一个分支
- 主分支即 master 分支，head 指向 master，master 指向提交，每次提交 master 分支都会向前移动一步，随着不断提交 master 分支的线也越来越长。
- 开发分支即 develop 分支，用来生成代码的最新隔夜版本（nightly）。如果想正式对外发布，就在 Master 分支上，对 Develop 分支进行"合并"（merge）。

### 9.2 分支操作

- 创建分支：`git branch <name>`
- 创建 develop 分支并切换：`$ git checkout -b dev`
  - git-checkout 命令加上-b 参数表示创建分支并切换
- 查看当前分支：`$ git branch`
  - 列出所有分支，当前分支前面会标一个\*号
- 在当前分支 dev 上提交：`$ git add` 、`$ git commit -m ""`
- 切换回主 Master 分支：`$ git checkout master`
- 把 dev 分支的工作成果合并到 master 分支上： `$ git merge dev`
  - git merge 命令用于合并指定分支到当前分支
- 删除 dev 分支：\$ git branch -d dev

### 9.3 分支冲突及策略

- 当 Git 无法自动合并分支时，就必须首先解决冲突。解决冲突后，再提交，合并完成。

用 git log --graph 命令可以看到分支合并图：`$ git log --graph --pretty=online`

- 分支策略：首先，master 分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；每个人都在 dev 分支上干活，每个人都有自己的分支，时不时地往 dev 分支上合并

合并分支时，加上--no-ff 参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，而 fast forward 合并就看不出来曾经做过合并。

//`$ git merge --no-ff -m "merge with no-ff" dev`

### 9.4 bug 与 feature

Bug 分支：

- 修复 bug 时，我们会通过创建新的 bug 分支进行修复，然后合并，最后删除；

当手头工作没有完成时，先把工作现场 git stash 一下，然后去修复 bug，修复后，再 git stash pop，回到工作现场。//你可以多次 stash，恢复的时候，先用 git stash list 查看，然后恢复指定的 stash

feature 分支：

- 开发一个新 feature，最好新建一个分支；如果要丢弃一个没有被合并过的分支，可以通过 git branch -D 强行删除。

### 9.5 远程相关

推送分支：

- 查看远程库信息：`$ git remote -v`

要指定本地分支，这样，Git 就会把该分支推送到远程库对应的远程分支上：`$ git push origin master`、`$ git push origin dev`

抓取分支：

- 在本地创建和远程分支对应的分支：`$ git checkout -b branch-name origin/branch-name`，本地和远程分支的名称最好一致
- 建立本地分支和远程分支的关联：`$ git branch --set-upstream-to=origin/<branch-name> <branch-name>`
- 从远程抓取分支，使用：`$ git pull`

多人协作：

- 首先，可以试图推送自己的修改：`$ git push origin <branch-name>`
- 如果推送失败，则因为远程分支比你的本地更新，需要先试图把最新的提交从 origin/dev 抓下来自动合并：`$ git pull`
  - `$ git fetch`：是从远程获取最新版本到本地，不会自动 merge；
- 如果合并有冲突，则解决冲突，并在本地提交；
- 如果 git pull 提示 no tracking information，则说明本地分支和远程分支的链接关系没有创建：
  - `$ git branch --set-upstream-to=origin/<branch-name> <branch-name>`
  - 没有冲突或者解决掉冲突后，再用：`$ git push origin <branch-name>`

## 10.创建标签

命令 git tag 用于新建一个标签，默认为 HEAD，也可以指定一个 commit id；

命令 git tag -a  -m "blablabla..."可以指定标签信息；

命令 git tag 可以查看所有标签。//标签总是和某个 commit 挂钩。如果这个 commit 既出现在 master 分支，又出现在 dev 分支，那么在这两个分支上都可以看到这个标签

## 11.操作标签

命令 git push origin 可以推送一个本地标签；

命令 git push origin --tags 可以推送全部未推送过的本地标签；

命令 git tag -d 可以删除一个本地标签；

命令 git push origin :refs/tags/可以删除一个远程标签。

## 12.Github

在 GitHub 上，可以任意 Fork 开源仓库；自己拥有 Fork 后的仓库的读写权限；可以推送 pull request 给官方仓库来贡献代码。
