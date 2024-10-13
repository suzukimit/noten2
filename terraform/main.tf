provider "google" {
  project = "noten2-dev"
  region  = "asia-northeast2"
}

resource "google_storage_bucket" "example_bucket" {
  name     = "noten-dev-20241005"
  location = "ASIA-NORTHEAST2"
  storage_class = "NEARLINE"
}

resource "google_storage_bucket" "frontend_deploy" {
  name     = "noten-frontend-deploy"
  location = "ASIA-NORTHEAST2"
  storage_class = "STANDARD"
}



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

resource "google_compute_managed_ssl_certificate" "managed_ssl_cert" {
  name       = "frontend-managed-ssl-cert"
  managed {
    domains = ["noten.tokyo"]
  }
}

resource "google_compute_target_https_proxy" "https_proxy" {
  name        = "frontend-https-proxy"
  ssl_certificates = [google_compute_managed_ssl_certificate.managed_ssl_cert.id]
  url_map     = google_compute_url_map.cdn_url_map.id
}

resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  name       = "frontend-https-forwarding-rule"
  target     = google_compute_target_https_proxy.https_proxy.id
  port_range = "443"
  load_balancing_scheme = "EXTERNAL"
}
