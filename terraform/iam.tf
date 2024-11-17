# resource "google_project_iam_member" "cloudbuild_artifactregistry_writer" {
#   project = local.project_id
#   role    = "roles/artifactregistry.writer"
#   member  = "serviceAccount:${local.project_number}@cloudbuild.gserviceaccount.com"
# }

resource "google_project_iam_member" "cloudbuild_run_admin" {
  project = local.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${local.project_number}@cloudbuild.gserviceaccount.com"
}

# cloud runのデフォルトサービスアカウントは使用しないほうが良いらしく、deploy時にserviceAccountを指定したいため
# https://cloud.google.com/run/docs/securing/service-identity?hl=ja#default_service_account
resource "google_project_iam_member" "cloudbuild_service_account_user" {
  project = local.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${local.project_number}@cloudbuild.gserviceaccount.com"
}
