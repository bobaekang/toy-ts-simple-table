import sqlite3 from 'sqlite3'

// type definitions
export type Variable = {
  name: string
  value: number | string
}

export type Row = Variable[]

export type flatRow = { [key: string]: number | string }

export type Table = Row[]

export type TableDTO = flatRow[]

// Table functions
export function filter(
  tbl: Table,
  by: string,
  matchIf: '==' | '<=' | '>=' | '<' | '>',
  value: number,
): Table {
  return tbl.filter(r => {
    let match = false

    r.some(v => {
      if (v.name == by) {
        switch (matchIf) {
          case '==':
            match = v.value == value
            break
          case '<=':
            match = v.value <= value
            break
          case '>=':
            match = v.value >= value
            break
          case '<':
            match = v.value < value
            break
          case '>':
            match = v.value > value
        }
        return true
      }
    })

    return match
  })
}

export function select(tbl: Table, ...varNames: string[]): Table {
  return tbl.map(r => {
    return r.filter(v => varNames.includes(v.name))
  })
}

export function sortBy(
  tbl: Table,
  by: string,
  order: 'asc' | 'desc' = 'asc',
): Table {
  const compare = (a: Row, b: Row): number => {
    let va: number | string = ''
    let vb: number | string = ''

    a.forEach(v => {
      if (v.name == by) va = v.value
    })

    b.forEach(v => {
      if (v.name == by) vb = v.value
    })

    if (va < vb) return order === 'asc' ? -1 : 1
    if (va > vb) return order === 'asc' ? 1 : -1
    return 0
  }

  return tbl
    .map((row, index) => ({ row, index }))
    .sort((a, b) => compare(a.row, b.row) || a.index - b.index)
    .map(({ row }) => row)
}

export function flatten(tbl: Table): TableDTO {
  return tbl.map(row => {
    const flatRow: flatRow = {}

    row.forEach(variable => {
      flatRow[variable.name] = variable.value
    })

    return flatRow
  })
}

export function unflatten(tbl: TableDTO): Table {
  return tbl.map(flatRow => {
    const row: Row = []

    Object.keys(flatRow).forEach(name => {
      row.push({ name, value: flatRow[name] })
    })

    return row
  })
}

export async function fetchFromDB(db: sqlite3.Database): Promise<Table> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all('SELECT * FROM Data', (err: Error, rows: TableDTO) => {
        if (err) reject('Error: SQLite')
        else resolve(unflatten(rows))
      })
    })
  })
}
