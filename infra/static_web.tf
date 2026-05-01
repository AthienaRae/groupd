resource "azurerm_static_web_app" "groupd" {
  name                = var.static_web_app_name
  resource_group_name = var.resource_group_name
  location            = var.static_web_location
  sku_tier            = "Free"
  sku_size            = "Free"
}