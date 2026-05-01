variable "location" {
  default = "southeastasia"
}

variable "static_web_location" {
  default = "eastasia"
}

variable "resource_group_name" {
  default = "Groupd"
}

variable "cosmos_account_name" {
  default = "groupddb"
}

variable "acr_name" {
  default = "groupdregistry"
}

variable "container_app_name" {
  default = "groupdbackend"
}

variable "container_app_env_name" {
  default = "managedEnvironment-Groupd-9be2"
}

variable "log_analytics_name" {
  default = "workspacegroupdb179"
}

variable "static_web_app_name" {
  default = "groupdfrontend"
}