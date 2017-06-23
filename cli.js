#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const h = require('virtual-hyperscript-svg')
const toString = require('virtual-dom-stringify')

const pkg = require('./package.json')
const generate = require('.')

const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    generate-vbb-transit-map
Examples:
    cat graph.json | generate-vbb-transit-map > map.svg
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`generate-vbb-transit-map v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const styles = h('style', {}, `
	.todo {
	}
`)

let input = ''
process.stdin
.on('error', showError)
.on('data', (d) => {
	input += d.toString('utf8')
})
.once('end', () => {
	try {
		const graph = JSON.parse(input)

		const map = generate(graph)
		const svg = h('svg', {
		    width: '100',
		    height: '100',
		    viewBox: '0 0 100 100'
		}, [styles, map])

		process.stdout.write(toString(svg))
	} catch (err) {
		return showError(err)
	}
})
