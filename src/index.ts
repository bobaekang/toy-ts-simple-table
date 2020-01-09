import { Int, toInt } from './int'

// type definitions
type Variable = {
  name: string,
  value: Int
}

type Row = {
  variables: Variable[],
  value: Int
}

type Table = Row[]

type TableDTO = any[]

// Table functions
const Filter = function(tbl: Table, by: string, matchIf: string, value: Int): Table {
  return tbl.filter(r => {
    let match = false

    r.variables.some(v => {
      if (v.name == by) {
        switch(matchIf) {
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

const Select = function(tbl: Table, ...varNames: string[]): Table {
  return tbl.map(r => {
    let selected = r.variables.filter(v => varNames.includes(v.name))
    
    return {
      variables: selected,
      value: r.value
    }
  })
}

const SortBy = function(tbl: Table, by: string, order: string = "asc"): Table {
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
const Flatten = (tbl: Table): TableDTO => {
  return tbl.map(row => {
    const flatRow = {} as any

    row.variables.forEach(variable => {
      flatRow[variable.name] = variable.value
    })

    flatRow.value = row.value

    return flatRow
  })
}

const Unflatten = (tbl: TableDTO): Table => {
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

const FetchFromDB = async (db: any): Promise<Table> => {  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all("SELECT * FROM Data", (err: any, rows: any) => {
        if (err) reject("Error: SQLite")
        else resolve(Unflatten(rows))
      })
    })
  })
}


// try
const main = async () => {
  const sampleTable: Table = [
    {
      variables: [
        {name: "a", value: 1} as Variable,
        {name: "b", value: 1} as Variable
      ],
      value: toInt(1)
    },
    {
      variables: [
        {name: "a", value: 1} as Variable,
        {name: "b", value: 2} as Variable
      ],
      value: toInt(2)
    },
    {
      variables: [
        {name: "a", value: 2} as Variable,
        {name: "b", value: 1} as Variable
      ],
      value: toInt(3)
    },
    {
      variables: [
        {name: "a", value: 2} as Variable,
        {name: "b", value: 2} as Variable
      ],
      value: toInt(4)
    },
  ]

  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database("./data.db")

  const prettyPrint = (name: string, obj: any) =>
    console.log(name + '\n' + JSON.stringify(obj, null, 2) + '\n')

  const filtered = Filter(sampleTable, "a", "==", toInt(1))
  const sorted = SortBy(sampleTable, "b")
  const selected = Select(sampleTable, "a")
  const flattened = Flatten(sampleTable)
  const unflattened = Unflatten(flattened)
  const fetched = await FetchFromDB(db)

  db.close()


  prettyPrint("sample", sampleTable)
  prettyPrint("filtered: a == 1", filtered)
  prettyPrint("sorted by: b(asc)", sorted)
  prettyPrint("selected: a", selected)
  prettyPrint("flattened", flattened)
  prettyPrint("unflattened", unflattened)
  prettyPrint("fetched from DB", fetched)
}

main()