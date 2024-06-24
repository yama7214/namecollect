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
        name: '株式会社エーエスピー',
        address: '〒103-0013　東京都中央区日本橋人形町3丁目3-13　オーキッドプレイス人形町ウエスト4F',
        phone_no: '03-3249-6297'
      },
    }
  ],

  //名寄対象と名寄方法
  target: {
    //名寄対象その1:名刺
    CustomerMS20: {
      //名寄ルールを選択（ExactMatch...全paramが一致することを求める方式）
      rule: 'ExactMatchRule',
      //paramと名寄対象の項目のマッピング
      //1対1, n対1, 1対n, n対nでのマッチングが可能（複射の場合は、ORマッチング）
      map: {
        name: ['name', 'name_other'],
        address: 'address',
        tel_no: 'phone_no'
      }
    },
  }
}
