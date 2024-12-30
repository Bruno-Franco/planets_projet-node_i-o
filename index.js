import { parse } from 'csv-parse'
import fs from 'fs'

const koi = []

function isHabitable() {
	let planets = []
	koi.forEach((planet) =>
		planet.koi_disposition === 'CONFIRMED' &&
		planet.koi_insol > 0.36 &&
		planet.koi_insol < 1.11 &&
		planet.koi_prad < 1.6
			? (planets = [
					...planets,
					{
						candidate: planet.koi_disposition,
						name: planet.kepler_name,
						insulation_flux: planet.koi_insol,
						planetary_radius: planet.koi_prad,
						period: planet.koi_period,
						transition: planet.koi_duration,
					},
			  ])
			: ''
	)

	return planets
}

let reader = fs.createReadStream('kepler_data.csv')
reader
	.pipe(
		parse({
			comment: '#',
			columns: true,
		})
	)
	.on('data', (data) => {
		koi.push(data)
	})
	.on('error', (err) => {
		console.log(err)
	})
	.on('end', () => {
		// console.log(koi)
		// console.log('done')
		console.log(isHabitable())
		console.log(
			`There is aprox ${isHabitable().length} in ${
				koi.length
			} planets using a basic criteria that coulb be habitable by humans!!!❤️`
		)
	})
