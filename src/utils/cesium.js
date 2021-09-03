import * as _Cesium from 'cesium'
import CesiumNavigation from 'cesium-navigation-es6'
import GmMaterialProperty, { source, logo } from './GmMaterialProperty'

const Cesium = {
  ..._Cesium,
  GmMaterialProperty
}

Cesium.Material.GmType = 'Gm'
Cesium.Material._materialCache.addMaterial(Cesium.Material.GmType, {
  fabric: {
    type: Cesium.Material.GmType,
    source,
    uniforms: {
      color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
      image: logo,
      time: 20
    }
  },
  translucent(material) {
    return true
  }
})

export { CesiumNavigation }
export default Cesium
