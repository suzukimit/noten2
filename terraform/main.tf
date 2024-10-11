provider "google" {
  project = "noten2-dev"
  region  = "asia-northeast2"
}

resource "google_storage_bucket" "example_bucket" {
  name     = "noten-dev-20241005"
  location = "ASIA-NORTHEAST2"
  storage_class = "NEARLINE"
}
