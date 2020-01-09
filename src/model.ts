import { Int, toInt } from './int'

// type definitions
export type Variable = {
  name: string,
  value: Int
}

export type Row = {
  variables: Variable[],
  value: Int
}

export type Table = Row[]

export type TableDTO = any[]

// Table functions
export const filter = (tbl: Table, by: string, matchIf: string, value: Int): Table => {
  return tbl.filter(r => {
    let match = false

    r.variables.some(v => {
      if (v.name == by) {
        switch (matchIf) {
          case "==":
            match = v.value == value
            break
          case "<=":
            match = v.value <= value
            break
          case ">=":
            match = v.value >= value
            break
          case "<":
            match = v.value < value
            break
          case ">":
            match = v.value > value
        }
        return true
      }
    })

    return match
  })
}

export const select = (tbl: Table, ...varNames: string[]): Table => {
  return tbl.map(r => {
    let selected = r.variables.filter(v => varNames.includes(v.name))

    return {
      variables: selected,
      value: r.value
    }
  })
}

export const sortBy = (tbl: Table, by: string, order: string = "asc"): Table => {
  const compare = (a: Row, b: Row): number => {
    let va = toInt(0)
    let vb = toInt(0)

    a.variables.forEach(v => {
      if (v.name == by) va = v.value
    })

    b.variables.forEach(v => {
      if (v.name == by) vb = v.value
    })

    return order === "desc" ? vb - va : va - vb
  }

  return tbl
    .map((row, index) => ({ row, index }))
    .sort((a, b) => compare(a.row, b.row) || a.index - b.index)
    .map(({ row }) => row)
}

export const flatten = (tbl: Table): TableDTO => {
  return tbl.map(row => {
    const flatRow = {} as any

    row.variables.forEach(variable => {
      flatRow[variable.name] = variable.value
    })

    flatRow.value = row.value

    return flatRow
  })
}

export const unflatten = (tbl: TableDTO): Table => {
  return tbl.map(flatRow => {
    let variables = [] as Variable[]
    let value = toInt(0)

    Object.keys(flatRow).forEach(key => {
      if (key == 'value') value = toInt(flatRow[key])
      else variables.push({ name: key, value: toInt(flatRow[key]) })
    })

    return {
      variables,
      value
    }
  })
}

export const fetchFromDB = async (db: any): Promise<Table> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all("SELECT * FROM Data", (err: any, rows: any) => {
        if (err) reject("Error: SQLite")
        else resolve(unflatten(rows))
      })
    })
  })
}
