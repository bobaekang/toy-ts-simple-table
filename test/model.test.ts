import assert from 'assert'
import {
  Table,
  TableDTO,
  filter,
  sortBy,
  select,
  flatten,
  unflatten,
  fetchFromDB,
} from '../src/model'

const sampleTable: Table = [
  [
    { name: 'A', value: 1 },
    { name: 'B', value: 1 },
    { name: 'value', value: 1 },
  ],
  [
    { name: 'A', value: 1 },
    { name: 'B', value: 2 },
    { name: 'value', value: 2 },
  ],
  [
    { name: 'A', value: 2 },
    { name: 'B', value: 1 },
    { name: 'value', value: 3 },
  ],
  [
    { name: 'A', value: 2 },
    { name: 'B', value: 2 },
    { name: 'value', value: 4 },
  ],
]

const sampleTableDTO: TableDTO = [
  { A: 1, B: 1, value: 1 },
  { A: 1, B: 2, value: 2 },
  { A: 2, B: 1, value: 3 },
  { A: 2, B: 2, value: 4 },
]

describe('filter', () => {
  describe('by: A, matchIf: ==, value: 1', () => {
    it('should return a filtered Table only with Rows where variable A == 1', () => {
      const actual = filter(sampleTable, 'A', '==', 1)
      const expected: Table = [
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 1 },
          { name: 'value', value: 1 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 2 },
          { name: 'value', value: 2 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })

  describe('by: A, matchIf: <=, value: 1', () => {
    it('should return a filtered Table only with Rows where variable A <= 1', () => {
      const actual = filter(sampleTable, 'A', '<=', 1)
      const expected: Table = [
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 1 },
          { name: 'value', value: 1 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 2 },
          { name: 'value', value: 2 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })

  describe('by: A, matchIf: >=, value: 2', () => {
    it('should return a filtered Table only with Rows where variable A >= 2', () => {
      const actual = filter(sampleTable, 'A', '>=', 2)
      const expected: Table = [
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 1 },
          { name: 'value', value: 3 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 2 },
          { name: 'value', value: 4 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })

  describe('by: B, matchIf: <, value: 2', () => {
    it('should return a filtered Table only with Rows where variable B < 2', () => {
      const actual = filter(sampleTable, 'B', '<', 2)
      const expected: Table = [
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 1 },
          { name: 'value', value: 1 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 1 },
          { name: 'value', value: 3 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })

  describe('by: B, matchIf: >, value: 1', () => {
    it('should return a filtered Table only with Rows where variable B > 1', () => {
      const actual = filter(sampleTable, 'B', '>', 1)
      const expected: Table = [
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 2 },
          { name: 'value', value: 2 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 2 },
          { name: 'value', value: 4 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })
})

describe('sortBy', () => {
  describe('by: B', () => {
    it('should return a Table sorted by B in ascending order', () => {
      const actual = sortBy(sampleTable, 'B')
      const expected: Table = [
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 1 },
          { name: 'value', value: 1 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 1 },
          { name: 'value', value: 3 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 2 },
          { name: 'value', value: 2 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 2 },
          { name: 'value', value: 4 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })

  describe('by: A, order: desc', () => {
    it('should return a Table sorted by A in descending order', () => {
      const actual = sortBy(sampleTable, 'A', 'desc')
      const expected: Table = [
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 1 },
          { name: 'value', value: 3 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 2 },
          { name: 'value', value: 4 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 1 },
          { name: 'value', value: 1 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 2 },
          { name: 'value', value: 2 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })

  describe('by: B, order: asc', () => {
    it('should return a Table sorted by B in ascending order', () => {
      const actual = sortBy(sampleTable, 'B', 'asc')
      const expected: Table = [
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 1 },
          { name: 'value', value: 1 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 1 },
          { name: 'value', value: 3 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 2 },
          { name: 'value', value: 2 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 2 },
          { name: 'value', value: 4 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })

  describe('by: value, order: desc', () => {
    it('should return a Table sorted by value in descending order', () => {
      const actual = sortBy(sampleTable, 'value', 'desc')
      const expected: Table = [
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 2 },
          { name: 'value', value: 4 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'B', value: 1 },
          { name: 'value', value: 3 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 2 },
          { name: 'value', value: 2 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'B', value: 1 },
          { name: 'value', value: 1 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })
})

describe('select', () => {
  describe('varNames: A', () => {
    it('should return a Table with variable A only', () => {
      const actual = select(sampleTable, 'A', 'value')
      const expected: Table = [
        [
          { name: 'A', value: 1 },
          { name: 'value', value: 1 },
        ],
        [
          { name: 'A', value: 1 },
          { name: 'value', value: 2 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'value', value: 3 },
        ],
        [
          { name: 'A', value: 2 },
          { name: 'value', value: 4 },
        ],
      ]

      assert.deepEqual(actual, expected)
    })
  })
})

describe('flatten', () => {
  it('should return a flattened Table based on a proper Table', () => {
    const actual = flatten(sampleTable)
    const expected = sampleTableDTO

    assert.deepEqual(actual, expected)
  })
})

describe('unflatten', () => {
  it('should return a proper Table based on a flattened Table', () => {
    const actual = unflatten(sampleTableDTO)
    const expected = sampleTable

    assert.deepEqual(actual, expected)
  })
})

describe('fetchFromDB', () => {
  it('should return a proper Table fetched from a local SQLite database', async () => {
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data.db')
    const actual = await fetchFromDB(db)
    db.close()

    const expected: Table = [
      [
        { name: 'A', value: 1 },
        { name: 'B', value: 1 },
        { name: 'value', value: 1 },
      ],
      [
        { name: 'A', value: 1 },
        { name: 'B', value: 2 },
        { name: 'value', value: 2 },
      ],
    ]

    assert.deepEqual(actual, expected)
  })
})
