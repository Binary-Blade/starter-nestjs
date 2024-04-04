# === MIGRATIONS ====
# Create a new migration
migrate-create:
	@read -p "Enter migration name: " name; \
	name=$$name pnpm run migration:create 

# Run migrations
migrate-run:
	docker-compose exec dev pnpm run migration:run

# Revert the last migration
migrate-revert:
	docker-compose exec dev pnpm run migration:revert

# === TESTING ====
test:
	docker-compose exec dev pnpm run test

.PHONY: migrate-create migrate-run migrate-revert test
