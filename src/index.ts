import { Table } from './model'

// define main
function main(): void {
  const prettyPrint = (name: string, obj: Table): void => {
    console.log(name + '\n' + JSON.stringify(obj, null, 2) + '\n')
  }

  const sampleTable: Table = [
    [
      { name: 'A', value: 1, type: 'number' },
      { name: 'B', value: 1, type: 'number' },
      { name: 'value', value: 1, type: 'number' },
    ],
    [
      { name: 'A', value: 1, type: 'number' },
      { name: 'B', value: 2, type: 'number' },
      { name: 'value', value: 2, type: 'number' },
    ],
    [
      { name: 'A', value: 2, type: 'number' },
      { name: 'B', value: 1, type: 'number' },
      { name: 'value', value: 3, type: 'number' },
    ],
    [
      { name: 'A', value: 2, type: 'number' },
      { name: 'B', value: 2, type: 'number' },
      { name: 'value', value: 4, type: 'number' },
    ],
  ]

  prettyPrint('sample', sampleTable)
}

// run main
main()
