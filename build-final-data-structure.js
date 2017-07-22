const parsed = require('./intermediate/chapters.json')
const flatten = require('just-flatten')

function main() {
	console.log(
		json(
			buildFinalForm(parsed)['1 Samuel']
		)
	)
}


function buildFinalForm(chunks) {
	const mapOfBooks = makeMapOfBooks(chunks)

	Object.keys(mapOfBooks).forEach(bookName => {
		mapOfBooks[bookName] = fixChunks(mapOfBooks[bookName])
	})

	return mapOfBooks
}


function makeMapOfBooks(arrayOfChapters) {
	const map = emptyMap()

	arrayOfChapters.forEach(chapter => {
		const bookName = chapter.bookName
		map[bookName] = map[bookName] || []
		map[bookName].push(chapter)
	})

	Object.keys(map).forEach(bookName => {
		map[bookName] = flatten(sortChapters(map[bookName]).map(chapter => {
			const chapterNumber = chapter.chapterNumber

			const chapterNumberChunk = { type: 'chapter number', value: chapterNumber }

			return [ chapterNumberChunk, ...chapter.chunks ]
		}))
	})

	return map
}

function sortChapters(chapters) {
	return [ ...chapters ].sort((a, b) => a.chapterNumber - b.chapterNumber)
}

const emptyMap = () => Object.create(null)





















function fixChunks(chunks) {
	return pipe(chunks,
		moveChapterNumbersIntoVerseText,
		mergeContinuedParagraphs,
		addVerseNumberToVerses,
		putContiguousLinesInsideOfStanzaStartAndEnd,
		turnBreaksInsideOfStanzasIntoStanzaStartAndEnds,
	)
}

const pipe = (value, ...fns) => fns.reduce((previous, fn) => fn(previous), value)

function moveChapterNumbersIntoVerseText(chunks) {
	let currentChapterNumber = null
	return chunks.map(chunk => {
		if (chunk.type === 'chapter number') {
			currentChapterNumber = chunk.value
		} else if (chunk.type === 'paragraph text') {
			return Object.assign({
				chapterNumber: currentChapterNumber
			}, chunk)
		} else {
			return chunk
		}
	}).filter(truthy)
}

function mergeContinuedParagraphs(chunks) {
	const output = []

	chunks.forEach(chunk => {
		if (chunk.type === 'continue previous paragraph') {
			output.pop()
		} else {
			output.push(chunk)
		}
	})

	assert(numberOfType(output, 'continue previous paragraph') === 0)
	assert(numberOfType(output, 'start paragraph') === numberOfType(output, 'end paragraph'))

	return output
}

function addVerseNumberToVerses(chunks) {
	let currentVerseNumber = null
	const output = []
	chunks.forEach(chunk => {
		if (chunk.type === 'verse number') {
			currentVerseNumber = chunk.value
		} else if (chunk.type === 'paragraph text' || chunk.type === 'line') {
			assert(currentVerseNumber !== null)
			output.push(Object.assign({
				verseNumber: currentVerseNumber
			}, chunk))
		} else {
			output.push(chunk)
		}
	})
	return output
}

function putContiguousLinesInsideOfStanzaStartAndEnd(chunks) {
	return chunks
}

function turnBreaksInsideOfStanzasIntoStanzaStartAndEnds(chunks) {
	return chunks
}

const truthy = value => value
const numberOfType = (chunks, type) => chunks.reduce((count, chunk) => {
	return count + (chunk.type === type ? 1 : 0)
}, 0)
const json = value => JSON.stringify(value, null, '\t')
function assert(value, message) {
	if (!value) {
		throw new Error(message || `ASSERT!`)
	}
}













// combine verses and add section numbers like https://github.com/TehShrike/pickering-majority-text-revelation/blob/bca642053201ac69ecc78dde79c6a997bcaf33e2/revelation.json
// convert "paragraph end" + "paragraph start"

main()
