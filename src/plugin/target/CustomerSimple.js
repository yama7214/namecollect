export let CustomerSimple = class {
  static instance

  static getInstance() {
    return CustomerSimple.instance
      ? CustomerSimple.instance
      : (CustomerSimple.instance = new CustomerSimple())
  }
  
  constructor() {
    this.type = 'simple'
    this.data = [
      {
        id: 'bc-001',
        name: '山下 晃司',
        address: '茨城県古河市東本町1-22-26 1008',
        phone_no1: '080-3244-6205',
        phone_no2: '0297-50-1131'
      },
      {
        id: 'bc-002',
        name: '山下 晃司',
        address: '茨城県古河市東本町1-22-26 1008',
        phone_no1: '080-3244-6205',
        phone_no2: '000-0000-0000'
      },
      {
        id: 'bc-003',
        name: '山下 晃司',
        address: '茨城県古河市東本町1-22-26 1008',
        phone_no1: '000-0000-0000',
        phone_no2: '0297-50-1131'
      },
      {
        id: 'bc-004',
        name: '山下 晃司',
        address: '茨城県古河市東本町1-22-26 1008',
        phone_no1: '000-0000-0000',
        phone_no2: '000-0000-0000'
      },
      {
        id: 'bc-005',
        name: '山下 しゃもじ',
        address: '茨城県古河市東本町1-22-26 1008',
        phone_no1: '080-3244-6205',
        phone_no2: '0297-50-1131'
      },
      {
        id: 'bc-006',
        name: '山下 晃司',
        address: '茨城県古河市東本町1-22-26 9999',
        phone_no1: '080-3244-6205',
        phone_no2: '0297-50-1131'
      }
    ]
  }

  /**
   * Queryの構造：
   * {
   *      least_match: "all" | number,
   *      match: [
   *          {
   *              param: [],
   *              column: []
   *          }
   *      ]
   * }
   */
  query(q) {
    let result = []

    if (!q.least_match)
      throw new Error('Qyery is incomplete: Does not contain least match.')
    let least_match
    least_match = q.least_match == 'all' ? q.match.length : q.least_match

    for (let d of this.data) {
      let match_count = 0
      q.match.forEach(
        (m) =>
          (match_count =
            match_count +
            Number(
              Object.keys(d)
                .filter((n) => m.column.includes(n))
                .filter((n) => m.param.includes(d[n])).length >= 1
            ))
      )

      if (match_count >= least_match) {
        let r = Object.assign({}, d)
        r.match_count = match_count
        result.push(r)
      }
    }

    return result
  }
}
