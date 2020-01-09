import { toInt } from './int'
import { Table, filter, sortBy, select, flatten, unflatten, fetchFromDB } from './model'

// define main
const main = async () => {
  const sampleTable: Table = [
    {
      variables: [
        { name: "a", value: toInt(1) },
        { name: "b", value: toInt(1) }
      ],
      value: toInt(1)
    },
    {
      variables: [
        { name: "a", value: toInt(1) },
        { name: "b", value: toInt(2) }
      ],
      value: toInt(2)
    },
    {
      variables: [
        { name: "a", value: toInt(2) },
        { name: "b", value: toInt(1) }
      ],
      value: toInt(3)
    },
    {
      variables: [
        { name: "a", value: toInt(2) },
        { name: "b", value: toInt(2) }
      ],
      value: toInt(4)
    },
  ]

  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database("./data.db")

  const prettyPrint = (name: string, obj: any) =>
    console.log(name + '\n' + JSON.stringify(obj, null, 2) + '\n')

  const filtered = filter(sampleTable, "a", "==", toInt(1))
  const sorted = sortBy(sampleTable, "b")
  const selected = select(sampleTable, "a")
  const flattened = flatten(sampleTable)
  const unflattened = unflatten(flattened)
  const fetched = await fetchFromDB(db)

  db.close()

  prettyPrint("sample", sampleTable)
  prettyPrint("filtered: a == 1", filtered)
  prettyPrint("sorted by: b(asc)", sorted)
  prettyPrint("selected: a", selected)
  prettyPrint("flattened", flattened)
  prettyPrint("unflattened", unflattened)
  prettyPrint("fetched from DB", fetched)
}

// run main
main()