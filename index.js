/**
 * Resources:
 * process.memoryUsage: https://www.valentinog.com/blog/memory-usage-node-js/
 * process.hrtime: https://nodejs.org/api/process.html#process_process_hrtime_time
 */

require('console.table')

const OBJECT_COUNT = 500000

const valueAsObject = {
	1: 'fMVZLrw4NnweGi8mgh3J',
	2: 'HVtuevke7csMeS1I4ohv',
	3: 'eAL1rmKhX0MDm5Nxrp29',
	4: '6jiu87URkgvpTTUXupw7',
	5: 'Oo1UBM3mBnvxIySVvhru',
	6: 'KroA774etPui9lA21M5H',
	7: 'Q7MWRvoaQhOFPNB8q8ae',
	8: 'KoDTpdFFM9ObhTYuZPrY',
	9: '8BpxfavpgCeitXAu9aS0',
	10: 'M9dNm3anXifstgq6RH6l'
}

const valuesAsList = Object
	.getOwnPropertyNames(valueAsObject)
	.map(key => valueAsObject[key])

const listOfObjects = []
const listOfArrays = []

for (let i = 0; i < OBJECT_COUNT; i++) {
	listOfObjects.push(valueAsObject)
	listOfArrays.push(valuesAsList)
}

const objectsPayload = JSON.stringify(listOfObjects)
const arraysPayload = JSON.stringify(listOfArrays)

/**
 * we have our payload strings built, now the profiling begins
 * -----------------------------------------------------------
 */	

runProfiling(
	'Parse Objects first, then Arrays',
	measuredPerformance('Parse Objects', () => JSON.parse(objectsPayload)),
	measuredPerformance('Parse Arrays', () => JSON.parse(arraysPayload))
)

runProfiling(
	'Parse Arrays first, then Objects',
	measuredPerformance('Parse Arrays', () => JSON.parse(arraysPayload)),
	measuredPerformance('Parse Objects', () => JSON.parse(objectsPayload))
)


/**
 * helpers
 * -----------------------------------------------------------
 */	

function measuredPerformance(name, action) {
	return function run() {
		const start = process.hrtime()
		action()
		const [ seconds, nanoseconds ] = process.hrtime(start)
		const executionDuration = `${((seconds / 1000) + (nanoseconds / 1000000)).toFixed(2)}ms`
		return { name, executionDuration }
	}
}

function runProfiling(label, ...executions) {
	const results = []
	for (const execution of executions) {
 		// collect garbage before each execution so that
 		// we get more accurate metrics
		tryCollectGarbage()
		const result = execution()
		const memory = getFormattedMemoryUsage()
		results.push({ ...result, ...memory })
	}
	console.table(`\n${label}`, results)
}

function tryCollectGarbage() {
	try {
		if (global.gc) {
			global.gc()
		} else {
			throw Error()
		}
	} catch(ex) {
		throw Error('Script must be run with `--expose-gc` flag: `node --expose-gc index.js`')
	}
}

function getFormattedMemoryUsage() {
	// we only care about heapTotal and heapUsed
	const { rss, external, ...usage } = process.memoryUsage()
	const usageFormatted = {}
	for (const key in usage) {
		usageFormatted[key] = `${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`
	}
	return usageFormatted
}