import fs from 'fs'
import _ from "lodash"

let roadRacesPath
if(process.env.NODE_ENV === "test") {
  roadRacesPath = "roadRacesTest.json"
} else {
  roadRacesPath = "roadRaces.json"
}

class RoadRace {
  constructor({ id, name, miles, location }) {
    this.id = id
    this.name = name
    this.miles = miles
    this.location = location
  }

  static findAll() {
    const roadRaceData = JSON.parse(fs.readFileSync(roadRacesPath)).roadRaces
    let roadRaces = []
    roadRaceData.forEach(roadRace => {
      const newRoadRace = new RoadRace(roadRace)
      roadRaces.push(newRoadRace)
    })
    return roadRaces
  }

  static getNextRaceId() {
    const maxRace = _.maxBy(this.findAll(), roadRace => roadRace.id)
    return maxRace.id + 1
  }

  save() {
    this.id = this.constructor.getNextRaceId()
    const roadRaces = this.constructor.findAll()
    roadRaces.push(this)
    const data = { roadRaces: roadRaces }
    fs.writeFileSync(roadRacesPath, JSON.stringify(data))
    return true
  }
}

export default RoadRace