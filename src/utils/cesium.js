import * as Cesium from 'cesium'
import CesiumNavigation from 'cesium-navigation-es6'

function addHeight(c, h) {
  const _c = Cesium.Cartographic.fromCartesian(c)
  _c.height += h
  return Cesium.Cartographic.toCartesian(_c)
}
function setHeight(c, h) {
  const _c = Cesium.Cartographic.fromCartesian(c)
  _c.height = h
  return Cesium.Cartographic.toCartesian(_c)
}

export { CesiumNavigation, addHeight, setHeight }
export default Cesium
