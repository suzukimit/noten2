resource "google_artifact_registry_repository" "docker_repository" {
  repository_id = "noten"
  format        = "DOCKER"
  location      = "asia-northeast2"
  description   = "Docker repository for storing images"
}
