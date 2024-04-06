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
# Run tests
test:
	docker-compose exec dev pnpm run test

# === REDIS ====

# Connect to the redis cli
redis-cli:
	docker-compose exec redis redis-cli

.PHONY: migrate-create migrate-run migrate-revert test redis
