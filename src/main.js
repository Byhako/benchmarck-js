const globalCode = document.querySelector('#global')
const sendButton = document.querySelector('.send-btn')



async function runTest({ code, data }) {
  const worker = new Worker(new URL('./worker.js', import.meta.url))
  worker.postMessage({ code, data, duration: 1000 })

  return new Promise(resolve => {
    worker.onmessage = event => {
      resolve(event.data)
    }
  })
}



async function runTestCases() {
  const testCases = document.querySelectorAll('.test-case')
  const codeGlobal = globalCode.value

  testCases.forEach(async testCase => {
    const code = testCase.querySelector('.code')
    const ops = testCase.querySelector('.ops')

    const codeValue = code.value
    ops.textContent = 'Loading...'

    const result = await runTest({ code: codeValue, data: codeGlobal })
    
    ops.textContent = `${result.toLocaleString()} ops/s`

  })
}

runTestCases()

sendButton.addEventListener('click', runTestCases)