let request_sample = {
    //複数のクエリを送信可能とする
    "query" :[{
        //リクエスト側がマッチしたい情報
        "param":{
            "name": "山下 晃司",
            "address": "茨城県古河市東本町1-22-26 1008",
            //複数の値を指定した場合、いずれかが一致すれば一致とみなす
            "phone_no": ["080-3244-6205", "0297-50-1131"]
        },

        //名寄対象と名寄方法
        "target":{
            //名寄対象その1:名刺
            "BusinessCard":{
                //名寄ルールを選択（ExactMatch...全paramが一致することを求める方式）
                "rule": "ExactMatchRule",
                //paramと名寄対象の項目のマッピング
                //1対1, n対1, 1対n, n対nでのマッチングが可能（複射の場合は、ORマッチング）
                "map": {
                    "name" : "name",
                    "address" : "address",
                    "phone_no": ["phone_no1", "phone_no2"]
                }
            },
            //名寄対象その2:顧客
            "Customer":{
                //名寄ルルールを選択（Exact Match of N...paramのうちN個が一致することを求める方式）
                "rule": "ExactMatchOfNRule",
                "rule_options": {
                    //電話番号は絶対一致が必要
                    "must_match" : ["phone_no"],
                    //それ以外に最低1つはマッチする必要がある
                    "least_match": 2
                },
                "map": {
                    "name" : "name",
                    "address" : "address",
                    "phone_no": ["phone_no1", "phone_no2"]
                }
            }
        }
    }]
}



let NameCollectionRequest = class{
    constructor(json_request){
        this.rowdata = json_request
    }
}