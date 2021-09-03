import * as Cesium from 'cesium'

import logo from '@assets/1.webp'

const { Color, defined, Event, createPropertyDescriptor, Property } = Cesium

/**
 * A {@link MaterialProperty} that maps to solid color {@link Material} uniforms.
 *
 * @param {Property|Color} [color=Color.WHITE] The {@link Color} Property to be used.
 * @param {Property|Number} [duration=2000] A numeric Property specifying how long will material animate.
 *
 * @alias GmMaterialProperty
 * @constructor
 */
function GmMaterialProperty(color, duration) {
  this._definitionChanged = new Event()
  this._color = undefined
  this._colorSubscription = undefined

  this._duration = undefined
  this._durationSubscription = undefined

  this._time = new Date().getTime()

  this.color = color
  this.duration = duration
}

Object.defineProperties(GmMaterialProperty.prototype, {
  /**
   * Gets a value indicating if this property is constant.  A property is considered
   * constant if getValue always returns the same result for the current definition.
   * @memberof GmMaterialProperty.prototype
   *
   * @type {Boolean}
   * @readonly
   */
  isConstant: {
    get: function () {
      return Property.isConstant(this._color)
    }
  },

  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is considered to have changed if a call to getValue would return
   * a different result for the same time.
   * @memberof GmMaterialProperty.prototype
   *
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function () {
      return this._definitionChanged
    }
  },

  /**
   * Gets or sets the {@link Color} {@link Property}.
   * @memberof GmMaterialProperty.prototype
   * @type {Property|undefined}
   * @default Color.WHITE
   */
  color: createPropertyDescriptor('color'),

  /**
   * Gets or sets the duration {@link Property}.
   * @memberof GmMaterialProperty.prototype
   * @type {Property|Number}
   * @default 2000
   */
  duration: createPropertyDescriptor('duration')
})

/**
 * Gets the {@link Material} type at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the type.
 * @returns {String} The type of material.
 */
GmMaterialProperty.prototype.getType = function (time) {
  return 'Gm'
}

/**
 * Gets the value of the property at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the value.
 * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
 * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
 */
GmMaterialProperty.prototype.getValue = function (time, result) {
  if (!defined(result)) {
    result = {}
  }
  result.color = Property.getValueOrClonedDefault(this._color, time, Color.WHITE, result.color)
  result.image = logo
  result.time = ((new Date().getTime() - this._time) % this.duration) / this.duration
  return result
}

/**
 * Compares this property to the provided property and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Property} [other] The other property.
 * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
GmMaterialProperty.prototype.equals = function (other) {
  return (
    this === other || //
    (other instanceof GmMaterialProperty && //
      Property.equals(this._color, other._color))
  )
}

export default GmMaterialProperty

const source = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
  material.alpha = colorImage.a * color.a;
  material.diffuse = (colorImage.rgb+color.rgb)/2.0;
  return material;
}`

export { logo, source }
