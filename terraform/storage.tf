resource "google_storage_bucket" "example_bucket" {
  name          = "noten-dev-20241005"
  location      = "ASIA-NORTHEAST2"
  storage_class = "NEARLINE"
}

resource "google_storage_bucket" "frontend_deploy" {
  name          = "noten-frontend-deploy"
  location      = "ASIA-NORTHEAST2"
  storage_class = "STANDARD"
}
