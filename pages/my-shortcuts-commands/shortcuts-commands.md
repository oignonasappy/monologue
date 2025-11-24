# 自分用ショートカット/コマンド集 

### 凡例
- + : 同時押し
- , : 続けて入力
- | : or
- [some] : 適当な入力

## bash

## vim/nvim
### normal
#### ノーマルモードへ移行
- Ctrl + [
- Esc
#### 移動
##### 左 
- h
- ←
##### 下
- j
- ↓
##### 上
- k
- ↑
##### 右
- l
- →
#### 削除
- d
#### ヤンク/コピー
- y
#### コマンド
- :
#### undo
- u
#### redo
- Ctrl + r
#### 挿入
##### カーソル位置に挿入
- i
##### 1文字後に挿入
- a
##### 次の行に挿入
- o

### visual
#### 文字
- v
#### 行
- V
#### 矩形
- Ctrl + v

### command(一般)
#### 保存
- :w
#### 終了
- :q
##### 無視して終了
- :q!
#### 置換
- :s
#### ヘルプ
- :help

#### command(buffer)
#### リスト
- :ls
#### buffer切り替え
- :b [num]
#### 次のbuffer
- :bn
#### 前のbuffer
- :bp
#### bufferを閉じる
- :bd
#### 直前のbufferに切り替え
- Ctrl + ^

### command(window)
#### 垂直分割
- :sp
- Ctrl + w, s
#### 水平分割
- vsp
- Ctrl + w, v
#### サイズ変更
##### 左に縮小
- Ctrl + w, < 
##### 右に拡大
- Ctrl + w, >
##### 上下拡大 
- Ctrl + w, +
##### 上下縮小
- Ctrl + w, -
##### 均等にする
- Ctrl + w, = 

### command(tab)
#### 新しいtab page
- :tabnew
#### 次のtab
- gt
- :tabnext
#### 前のtab
- gT
- :tabprev
#### tabを閉じる
- :tabc
#### tab一覧
- :tabs

### command(telescope)
#### ファイル検索
- :Telescope find_files
#### バッファ一覧
- :Telescope buffers
#### Git履歴
- :Telescope git_files

## tmux
### prefix
- Ctrl + b

### terminal
#### 再接続
- tmux attach
#### 新規セッション
- tmux new -s [name]

### session
#### 離脱
- PREFIX, d
#### リスト
- PREFIX, s
#### 終了
- PREFIX, $

### window
#### 新しいwindow
- PREFIX, c
#### 次のwindow
- PREFIX, n
#### 前のwindow
- PREFIX, p
#### 指定したwindow
- PREFIX, [num]
#### window名変更
- PREFIX, ,
#### windowを閉じる
- PREFIX, &

### pane
#### 垂直分割
- PREFIX, "
#### 水平分割
- PREFIX, %
#### pane移動
- PREFIX, ↑|→|↓|←
#### pane最大化トグル
- PREFIX, z
#### paneを閉じる
- PREFIX, x

### other
#### help
- PREFIX, p
#### command
- PREFIX, :
