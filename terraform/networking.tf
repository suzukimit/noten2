# バケットのバックエンド設定
resource "google_compute_backend_bucket" "frontend_deploy_bucket" {
  name        = "frontend-backend-bucket"
  bucket_name = google_storage_bucket.frontend_deploy.name
  enable_cdn  = true
  cdn_policy {
    cache_mode = "FORCE_CACHE_ALL"
  }
}

# URLマップの設定
resource "google_compute_url_map" "cdn_url_map" {
  name            = "frontend-url-map"
  default_service = google_compute_backend_bucket.frontend_deploy_bucket.id
}
