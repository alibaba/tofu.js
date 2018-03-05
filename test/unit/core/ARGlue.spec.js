const NAME = 'markerid';

describe('TOFU.ARGlue', function () {
  describe('parent', function () {
    it('should be present when adding children to Container', function () {
      var arGlue = new TOFU.ARGlue({
        name: NAME
      });
      expect(arGlue.name).to.be.equals(NAME);
      expect(arGlue.autoHide).to.be.equals(true);
      expect(arGlue.matrixAutoUpdate).to.be.equals(false);
      expect(arGlue.type).to.be.equals('ARGlue');

      expect(arGlue.children.length).to.be.equals(0);
      var child1 = new THREE.Object3D();
      var child2 = new THREE.Object3D();
      arGlue.add(child1, child2);
      expect(arGlue.children.length).to.be.equals(2);
    });
  });
});
