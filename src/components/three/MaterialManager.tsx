
import * as THREE from 'three';

export class MaterialManager {
  private static DEFAULT_COLOR = new THREE.Color(0xcccccc); // Light grey
  private static SELECTED_COLOR = new THREE.Color(0xF57B4E); // Orange
  private static HOVER_EMISSIVE = new THREE.Color(0x111111); // Subtle dark glow for hover

  static resetMeshToDefault(mesh: THREE.Mesh) {
    if (mesh && this.isMeshMaterial(mesh.material)) {
      mesh.material.color = this.DEFAULT_COLOR.clone();
      mesh.material.emissive = new THREE.Color(0x000000);
    }
  }

  static setMeshToSelected(mesh: THREE.Mesh) {
    if (mesh && this.isMeshMaterial(mesh.material)) {
      mesh.material.color = this.SELECTED_COLOR.clone();
      mesh.material.emissive = new THREE.Color(0x000000); // Remove any emissive
    }
  }

  static setMeshToHover(mesh: THREE.Mesh) {
    if (mesh && this.isMeshMaterial(mesh.material)) {
      mesh.material.emissive = this.HOVER_EMISSIVE.clone();
    }
  }

  static initializeMesh(mesh: THREE.Mesh) {
    if (this.isMeshMaterial(mesh.material)) {
      // Store original material for reference
      mesh.userData.originalMaterial = mesh.material;
      mesh.userData.isBuilding = true;
      mesh.userData.buildingName = mesh.name || `mesh_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create new material with default color
      const newMaterial = mesh.material.clone();
      newMaterial.color = this.DEFAULT_COLOR.clone();
      newMaterial.emissive = new THREE.Color(0x000000);
      mesh.material = newMaterial;
    }
  }

  // Make this method public for use in BuildingMesh
  static isMeshMaterial(material: THREE.Material | THREE.Material[]): material is THREE.MeshStandardMaterial | THREE.MeshLambertMaterial {
    if (Array.isArray(material)) return false;
    return 'color' in material && 'emissive' in material;
  }
}
