onmessage = async function(event) {
  const { code, data, duration } = event.data

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

  postMessage(result * (1000 / duration))
}