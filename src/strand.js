const THREE = require('three');
const resources = require('./resources');

class Strand {
  constructor(start, end, count = 2) {
    if (count < 2) {
      throw new Error('Strand must have at least two points');
    }

    this.pointCount = count;

    this.positions = new THREE.Float32BufferAttribute(this.pointCount * 3, 3);
    this.displacement = new THREE.Float32BufferAttribute(this.pointCount * 3, 3);
    this.color = new THREE.Float32BufferAttribute(3, 3);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', this.positions);
    this.geometry.addAttribute('displacement', this.displacement);
    this.geometry.addAttribute('color', this.color);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        r: { value: 1 },
        g: { value: 1 },
        b: { value: 1 },
      },
      vertexShader: resources['constraint-vertex-shader'],
      fragmentShader: resources['constraint-fragment-shader'],
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    this.object = new THREE.Line(this.geometry, material);

    // TODO use count to generate interpolated points
    this.set([start.clone(), end.clone()]);
  }

  set(newPoints) {
    if (newPoints.length !== this.pointCount) {
      throw new Error('Must set strand using array containing same number of points');
    }

    const { array } = this.geometry.attributes.position;
    for (let i = 0; i < newPoints.length; i += 1) {
      const ai = i * 3;
      array[ai] = newPoints[i].x;
      array[ai + 1] = newPoints[i].y;
      array[ai + 2] = newPoints[i].z;
    }

    this.object.geometry.attributes.position.needsUpdate = true;
  }
}

module.exports = Strand;
