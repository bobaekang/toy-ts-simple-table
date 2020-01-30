import { Table } from './model'

// define main
function main(): void {
  const prettyPrint = (name: string, obj: Table): void => {
    console.log(name + '\n' + JSON.stringify(obj, null, 2) + '\n')
  }

  const sampleTable: Table = [
    { A: 1, B: 1, value: 1 },
    { A: 1, B: 2, value: 2 },
    { A: 2, B: 1, value: 3 },
    { A: 2, B: 2, value: 4 },
  ]

  prettyPrint('sample', sampleTable)
}

// run main
main()
