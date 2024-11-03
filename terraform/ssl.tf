# resource "google_compute_managed_ssl_certificate" "managed_ssl_cert" {
#   name = "frontend-managed-ssl-cert"
#   managed {
#     domains = ["noten.tokyo"]
#   }
# }
#
# resource "google_compute_target_https_proxy" "https_proxy" {
#   name    = "frontend-https-proxy"
#   ssl_certificates = [google_compute_managed_ssl_certificate.managed_ssl_cert.id]
#   url_map = google_compute_url_map.cdn_url_map.id
# }
#
# resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
#   name                  = "frontend-https-forwarding-rule"
#   target                = google_compute_target_https_proxy.https_proxy.id
#   port_range            = "443"
#   load_balancing_scheme = "EXTERNAL"
# }
