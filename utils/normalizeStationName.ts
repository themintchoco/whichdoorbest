const normalizeStationName = (name: string) => {
  return name.replace(/\W/g, '').toLowerCase()
}

export default normalizeStationName
