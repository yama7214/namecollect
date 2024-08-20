## SB 名寄せサーバ(SB_NAMECOLLECT)仕様

<style>
    table {
      font-size: 75%;
    }
    th {
        background: grey;
        word-wrap: break-word;
        text-align: center;
    }

    img{
      display: block;
      margin: auto;
      height: 100%;
      width: 100%;
    }

    div {
      font-size: 120%;
    }
</style>

### 目的と特徴

---

SB_NAMECOLLECT の目的は以下の通りである。

（目的-1）
与えられた名刺・顧客情報に対して、クエリソース（例えば、SATORI）が指定したターゲットソース（例えば、REMIX）に同様の名刺・顧客情報が存在しているかを、指定したルールに従って検証し、その結果を返却する

（目的-2）
ターゲットソースから名刺・顧客の変更情報を受領し、クエリーソースから過去問い合わせがあった場合、クエリーソースに対して興味範囲（過去にクエリ対象とした顧客・名刺の）変更情報をブロードキャストする

（特徴-1）
REST API の公開によって、他サービスと疎結合して機能する

（特徴-2）
名寄せルールはプラグインとして実装されており、いつでも追加が可能

（特徴-3）
ターゲットソースはプラグインとして実装されており、いつでも追加が可能

### 用語解説

---

SB＿NAMECOLLECT で定義する用語を解説する

| 用語             | 英名               | 説明                                | 利用シーン                                                               |
| ---------------- | ------------------ | ----------------------------------- | ------------------------------------------------------------------------ |
| クエリソース     | QuerySource        | 名寄せサーバへの問い合わせ側        | - 名寄せ時の問合せ元身元照会<br>-ターゲットソース変更時の通知先          |
| ターゲットソース | TargetSource       | 名寄せサーバからの問い合わせ先      | -名寄せ時の問合せ先アクセス方法<br>-情報変更通知時の身元照会             |
| 項目マッピング   | ColumnMap          | クエリ-ターゲット間の項目マップ情報 | -名寄せ時に収集したクエリソース - ターゲットソース感の項目マッピング情報 |
| 名寄せルール     | CollectRule        | ルール別な寄せ処理                  | -名寄せ処理の実行                                                        |
| リポジトリ       | xxxRepository      | プラグイン対象の管理者              | -各種プラグイン登録,参照,更新,削除                                       |
| 名寄せサービス   | NameCollectService | 名寄せサービスへのアクセスポイント  | -外部からの名寄せサービス実行                                            |

```plantuml
class QuerySource{
  onTargetSourceChanged(changeData)
}

class TargetSource{
  query(query)
  broadCastChange(changeData)
}

class ColumnMap{}

class IdMap{}

class CollectRule{
  match(param, columnMap, target, ruleOption)
}
class CollectRuleRepository{
  registerCollectRule(collectRule)
}

class QuerySourceRepository{
  registerQuerySource(querySource)
}

class TargetSourceRepository{
  registerTargetSource(targetSource)
}

class NameCollectService{
  collect(request)
  broadcastChange(targetSource, changeData)
}

NameCollectService -- TargetSourceRepository
NameCollectService -- QuerySourceRepository
NameCollectService - CollectRuleRepository

TargetSourceRepository "1" o-- "*" TargetSource
CollectRuleRepository "1" o- "*" CollectRule
QuerySourceRepository "1" o-- "*" QuerySource

QuerySource "*" -  "*" TargetSource
(QuerySource, TargetSource) .. ColumnMap
(QuerySource, TargetSource) .. IdMap

```

### API 一覧

---

| API                  | 概要 | REQ | RES |
| -------------------- | ---- | --- | --- |
| クエリソース登録     |      |     |     |
| ターゲットソース登録 |      |     |     |
| 名寄せルール登録     |      |     |     |
| 名寄せ実行           |      |     |     |
| クエリソース登録     |      |     |     |
