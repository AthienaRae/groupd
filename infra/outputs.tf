output "cosmos_endpoint" {
  value = azurerm_cosmosdb_account.groupd.endpoint
}

output "acr_login_server" {
  value = azurerm_container_registry.groupd.login_server
}

output "container_app_url" {
  value = azurerm_container_app.groupdbackend.latest_revision_fqdn
}

output "static_web_app_url" {
  value = azurerm_static_web_app.groupd.default_host_name
}