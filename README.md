## 使用している技術

__バックエンド:__ Flask (Python) 、sqlite

__フロントエンド:__ React (Javascript)

__インフラ;__ Docker

## 使えるGitコマンド

① Github(オンライン上のデータ)の最新のコードを自分のパソコンに反映させる場合

 __git fetch origin__
 
 __git pull origin main__

②ファイルを編集してGithub上に反映させる

- 手順は以下

  __1.git add .__
  
  __2.git commmit -m "なんか書いてね"__
  
  __3.git push origin__
  
  流れとしては開発をする前に
  __git fetch origin__ で最新のコードにして、開発を行い、②を行ってください


## 誰かがnpm installを行った場合
- 下の写真のようなエラーが起きたときの対応を書いておきます。(10/18深夜の確認)
- package.jsonが変更されるのでnode_modulesに影響があります。package.jsonはgitで追跡してますがnode_modulesは追跡してないので再度環境に反映させる必要があります。
- 手順は次の通り
  
  __1. docker-compose down__
  
  __2. docker volume rm opencircle_node_modules_frontend__
  
  __3. docker-compose up --build__


<img width="1920" height="1140" alt="スクリーンショット 2025-10-18 010954" src="https://github.com/user-attachments/assets/84a18e1b-d7cb-452d-958d-43ddbed792e3" />



