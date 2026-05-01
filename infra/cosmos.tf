resource "azurerm_cosmosdb_account" "groupd" {
  name                = var.cosmos_account_name
  location            = var.location
  resource_group_name = var.resource_group_name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  tags = {
    defaultExperience         = "Core (SQL)"
    "hidden-workload-type"    = "Development/Testing"
    "hidden-cosmos-mmspecial" = null
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }
}

resource "azurerm_cosmosdb_sql_database" "groupd" {
  name                = "groupddb"
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.groupd.name
}

resource "azurerm_cosmosdb_sql_container" "groupd" {
  for_each = {
    users         = "/userId"
    teams         = "/teamId"
    notifications = "/userId"
    messages      = "/senderId"
  }
  name                = each.key
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.groupd.name
  database_name       = azurerm_cosmosdb_sql_database.groupd.name
  partition_key_paths = [each.value]
}