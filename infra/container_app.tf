resource "azurerm_log_analytics_workspace" "groupd" {
  name                = var.log_analytics_name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
}

resource "azurerm_container_app_environment" "groupd" {
  name                = var.container_app_env_name
  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_container_app" "groupdbackend" {
  name                         = var.container_app_name
  resource_group_name          = var.resource_group_name
  container_app_environment_id = azurerm_container_app_environment.groupd.id
  revision_mode                = "Single"

  template {
    container {
      name   = "groupdbackendv7"
      image  = "groupdregistry.azurecr.io/groupd-backend:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "COSMOS_ENDPOINT"
        value = azurerm_cosmosdb_account.groupd.endpoint
      }
      env {
        name  = "COSMOS_KEY"
        value = azurerm_cosmosdb_account.groupd.primary_key
      }
      env {
        name  = "COSMOS_DATABASE"
        value = "groupddb"
      }
      env {
        name  = "JWT_SECRET"
        value = "14a0ee54c2840bb4c555deabf1e6d459d24b9d60da6b15e442d30b949f3bbf17"
      }

      liveness_probe {
        transport = "TCP"
        port      = 8000
      }

      readiness_probe {
        transport = "TCP"
        port      = 8000
      }

      startup_probe {
        transport = "TCP"
        port      = 8000
      }
    }

    http_scale_rule {
      name                = "http-scaler"
      concurrent_requests = "10"
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server   = azurerm_container_registry.groupd.login_server
    identity = "system-environment"
  }
}