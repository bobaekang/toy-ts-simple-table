import { toInt } from './int'
import { Table } from './model'

// define main
const main = (): void => {
  const prettyPrint = (name: string, obj: Table): void =>
    console.log(name + '\n' + JSON.stringify(obj, null, 2) + '\n')

  const sampleTable: Table = [
    {
      variables: [
        { name: "A", value: toInt(1) },
        { name: "B", value: toInt(1) }
      ],
      value: toInt(1)
    },
    {
      variables: [
        { name: "A", value: toInt(1) },
        { name: "B", value: toInt(2) }
      ],
      value: toInt(2)
    },
    {
      variables: [
        { name: "A", value: toInt(2) },
        { name: "B", value: toInt(1) }
      ],
      value: toInt(3)
    },
    {
      variables: [
        { name: "A", value: toInt(2) },
        { name: "B", value: toInt(2) }
      ],
      value: toInt(4)
    },
  ]

  prettyPrint("sample", sampleTable)
}

// run main
main()
