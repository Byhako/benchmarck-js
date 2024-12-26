const globalCode = document.querySelector('#global')
const sendButton = document.querySelector('.send-btn')
const bars = document.querySelectorAll('.bar')
const percentages = document.querySelectorAll('.percentage')
const COLORS = ['green', 'yellow', 'red']

async function runTest({ code, data }) {
  const worker = new Worker(new URL('./worker.js', import.meta.url))
  worker.postMessage({ code, data, duration: 1000 })

  // return new Promise(resolve => {
  //   worker.onmessage = event => {
  //     resolve(event.data)
  //   }
  // })

  const { resolve, promise } = Promise.withResolvers()
  worker.onmessage = event => resolve(event.data)
  return promise
}


async function runTestCases() {
  bars.forEach(bar => bar.setAttribute('height', 0))
  percentages.forEach(p => p.textContent = '0%')
  const testCases = document.querySelectorAll('.test-case')
  const codeGlobal = globalCode.value

  const promises = Array.from(testCases).map(async (testCase) => {
    const code = testCase.querySelector('.code')
    const ops = testCase.querySelector('.ops')

    const codeValue = code.value
    ops.textContent = 'Loading...'

    const result = await runTest({ code: codeValue, data: codeGlobal })
    
    ops.textContent = `${result.toLocaleString()} ops/s`

    return result
  })

  const results = await Promise.all(promises)

  const maxOps = Math.max(...results)

  const sortedResults = results
    .map((result, index) => ({ result, index }))
    .sort((a, b) => b.result - a.result)

  sortedResults.forEach((result, index) => {
    const bar = bars[result.index]
    const percentage = percentages[result.index]

    const percentageValue = result.result / maxOps
    const height = percentageValue * 300
    const color = COLORS[index]

    bar.setAttribute('height', height)
    bar.setAttribute('fill', `${color}`)
    percentage.textContent = `${Math.round(percentageValue*100)}%`
  });
}

runTestCases()

sendButton.addEventListener('click', runTestCases)