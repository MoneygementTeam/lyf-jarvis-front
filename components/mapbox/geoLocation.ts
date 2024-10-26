export const currentGeoLocation = (): Promise<{
  latitude: number
  longitude: number
}> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        resolve({ latitude, longitude })
      })
    } else {
      resolve({ latitude: 0.0, longitude: 0.0 })
    }
  })
}
