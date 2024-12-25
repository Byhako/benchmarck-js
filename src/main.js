const globalCode = document.querySelector('#global')
const sendButton = document.querySelector('.send-btn')

async function runTest({ code, data }) {
  const duration = 1000

  let result

  try {
    result = await eval(`
      (async () => {
        let perf__ops = 0;
        const perf__end = Date.now() + ${duration};
        ${data};

        while (Date.now() < perf__end) {
          ${code};
          perf__ops++;
        }

        return perf__ops
      })()
    `)
  } catch (error) {
    console.error(error)
    result = 0
  }

  return result * (1000 / duration)

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
    console.log(result)

  })
}

runTestCases()

sendButton.addEventListener('click', runTestCases)