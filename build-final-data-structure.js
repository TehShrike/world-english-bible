const parsed = require('./intermediate/chapters.json')
const flatten = require('just-flatten')
const fs = require('fs')

const types = {
	PARAGRAPH_START: 'paragraph start',
	PARAGRAPH_END: 'paragraph end',
	STANZA_START: 'stanza start',
	STANZA_END: 'stanza end',
	PARAGRAPH_TEXT: 'paragraph text',
	LINE: 'line',
	CHAPTER_NUMBER: 'chapter number',
	VERSE_NUMBER: 'verse number',
	CONTINUE_PREVIOUS_PARAGRAPH: 'continue previous paragraph',
	BREAK: 'break',
}

const properKeyOrder = [
	'type',
	'chapterNumber',
	'verseNumber',
	'sectionNumber',
	'value',
]

const stanzaStart = { type: types.STANZA_START }
const stanzaEnd = { type: types.STANZA_END }



function main() {
	const finalForm = buildFinalForm(parsed)
	// console.log(
	// 	json(
	// 		finalForm['1 Samuel']
	// 	)
	// )

	Object.keys(finalForm).forEach(bookName => {
		const filename = turnBookNameIntoFileName(bookName)

		fs.writeFileSync('./json/' + filename + '.json', json(finalForm[bookName]))
	})
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

			const chapterNumberChunk = { type: types.CHAPTER_NUMBER, value: chapterNumber }

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
		removeBreaksBeforeStanzaStarts,
		addSectionNumbers,
		reorderKeys,
	)
}

const pipe = (value, ...fns) => fns.reduce((previous, fn) => fn(previous), value)

function moveChapterNumbersIntoVerseText(chunks) {
	let currentChapterNumber = null
	return chunks.map(chunk => {
		if (chunk.type === types.CHAPTER_NUMBER) {
			currentChapterNumber = chunk.value
		} else if (containsVerseText(chunk)) {
			return Object.assign({
				chapterNumber: currentChapterNumber,
			}, chunk)
		} else {
			return chunk
		}
	}).filter(truthy)
}

function mergeContinuedParagraphs(chunks) {
	const output = []

	chunks.forEach(chunk => {
		if (chunk.type === types.CONTINUE_PREVIOUS_PARAGRAPH) {
			output.pop()
		} else {
			output.push(chunk)
		}
	})

	assert(numberOfType(output, types.CONTINUE_PREVIOUS_PARAGRAPH) === 0)
	assert(numberOfType(output, types.PARAGRAPH_START) === numberOfType(output, types.PARAGRAPH_END))

	return output
}

function addVerseNumberToVerses(chunks) {
	let currentVerseNumber = null
	const output = []
	chunks.forEach(chunk => {
		if (chunk.type === types.VERSE_NUMBER) {
			currentVerseNumber = chunk.value
		} else if (containsVerseText(chunk)) {
			assert(currentVerseNumber !== null)
			output.push(Object.assign({
				verseNumber: currentVerseNumber,
			}, chunk))
		} else {
			output.push(chunk)
		}
	})
	return output
}

function putContiguousLinesInsideOfStanzaStartAndEnd(chunks) {
	let insideStanza = false
	return flatMap(chunks, chunk => {
		if (insideStanza && (chunk.type !== types.LINE && chunk.type !== types.BREAK)) {
			insideStanza = false
			return [ stanzaEnd, chunk ]
		} else if (!insideStanza && chunk.type === types.LINE) {
			insideStanza = true
			return [ stanzaStart, chunk ]
		} else {
			return chunk
		}
	})
}

function turnBreaksInsideOfStanzasIntoStanzaStartAndEnds(chunks) {
	let insideStanza = false
	return flatMap(chunks, chunk => {
		if (chunk.type === types.STANZA_START) {
			insideStanza = true
		} else if (chunk.type === types.STANZA_END) {
			insideStanza = false
		}

		if (insideStanza && chunk.type === types.BREAK) {
			return [ stanzaEnd, stanzaStart ]
		} else {
			return chunk
		}
	})
}

function removeBreaksBeforeStanzaStarts(chunks) {
	const output = []

	let last = null
	chunks.forEach(chunk => {
		if (chunk.type === types.BREAK) {
			last = chunk
			return
		} else if (last && chunk.type !== types.STANZA_START) {
			output.push(last)
		}

		last = null
		output.push(chunk)
	})

	return output
}

function addSectionNumbers(chunks) {
	let lastChapter = null
	let lastVerse = null
	let lastSection = 0

	return chunks.map(chunk => {
		if (containsVerseText(chunk)) {
			const { verseNumber, chapterNumber } = chunk

			if (verseNumber !== lastVerse || chapterNumber !== lastChapter) {
				lastChapter = chapterNumber
				lastVerse = verseNumber
				lastSection = 0
			}

			lastSection++

			return Object.assign({
				sectionNumber: lastSection,
			}, chunk)
		} else {
			return chunk
		}
	})
}

function reorderKeys(chunks) {
	return chunks.map(chunk => {
		const proper = {}

		properKeyOrder.forEach(key => {
			if (chunk[key] !== undefined) {
				proper[key] = chunk[key]
			}
		})

		return proper
	})
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
const flatMap = (array, fn) => flatten(array.map(fn))
const containsVerseText = chunk => chunk.type === types.PARAGRAPH_TEXT || chunk.type === types.LINE
const turnBookNameIntoFileName = bookName => bookName.replace(/ /g, '').toLowerCase()










// combine verses and add section numbers like https://github.com/TehShrike/pickering-majority-text-revelation/blob/bca642053201ac69ecc78dde79c6a997bcaf33e2/revelation.json
// convert "paragraph end" + "paragraph start"

main()
