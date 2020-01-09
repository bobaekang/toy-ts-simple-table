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
  return tbl.sort((ri, rj) => {
    let vi = {} as Variable
    let vj = {} as Variable

    ri.variables.forEach(v => {
      if (v.name == by) vi = v
    })

    rj.variables.forEach(v => {
      if (v.name == by) vj = v
    })

    const ri_before_rj =
      order == "desc" ? vi.value - vj.value : vj.value - vi.value
    const ri_after_rj =
      order == "desc" ? vj.value - vi.value : vj.value - vj.value

    if (ri_before_rj) return -1
    else if (ri_after_rj) return 1
    else return 0
  })
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
