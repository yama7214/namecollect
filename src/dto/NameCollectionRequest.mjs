export let request_sample = {
  //対象とするテナント
  tenant: 'esmtest5',

  query: [
    {
      //名寄元の識別子
      provider: 'SATORI',
      
      //リクエスト側のid
      id: 'SATORI-001',

      //リクエスト側がマッチしたい情報
      param: {
        "name_pre": '株式会社',
        "name_post": 'エ-エスピ―',
        "+name": 'name_pre+name_post',
        "address": '〒103-0013　東京都中央区日本橋人形町3丁目3-13　オーキッドプレイス人形町ウエスト4F',
        "tel": '00-0000-0000'
      },
    }
  ],

  //名寄対象と名寄方法
  target: {
    //名寄対象その1:名刺
    CustomerMS20:{
      //paramと名寄対象の項目のマッピング
      //1対1, n対1, 1対n, n対nでのマッチングが可能（複射の場合は、ORマッチング）
      map: {
        "name": ['name', 'name_other'],
        "address": 'address',
        "tel": 'tel_no'
      },
      rules:[{
        //名寄ルールを選択（ExactMatch...全paramが一致することを求める方式）
        rule: 'ExactMatchRule',
        ruleOption:{
          use:['name', 'address']
        }
      }]
    }
  }
}
