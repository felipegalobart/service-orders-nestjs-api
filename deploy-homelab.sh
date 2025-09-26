#!/bin/bash

# Service Orders API - Homelab Deployment Script
# This script helps deploy the NestJS API to your homelab environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="service-orders-api"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"

echo -e "${BLUE}🚀 Service Orders API - Homelab Deployment${NC}"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Determine which compose command to use
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Create environment file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}📝 Creating production environment file...${NC}"
    cp env.production.example "$ENV_FILE"
    echo -e "${YELLOW}⚠️  Please edit $ENV_FILE with your production values before continuing${NC}"
    echo -e "${YELLOW}   Important: Change JWT_SECRET, passwords, and other sensitive values${NC}"
    read -p "Press Enter after updating the environment file..."
fi

# Generate secure passwords if not set
if ! grep -q "your-secure" "$ENV_FILE"; then
    echo -e "${GREEN}✅ Environment file is properly configured${NC}"
else
    echo -e "${YELLOW}⚠️  Please update the environment file with secure values${NC}"
    exit 1
fi

# Update code from repository
echo -e "${BLUE}📥 Pulling latest changes from repository...${NC}"

# Check if this is a git repository
if [ -d ".git" ]; then
    # Check if we're on main branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo -e "${YELLOW}⚠️  Current branch is '$CURRENT_BRANCH', switching to main...${NC}"
        git checkout main
    fi
    
    # Pull latest changes
    if git pull origin main; then
        echo -e "${GREEN}✅ Code updated successfully from main branch${NC}"
    else
        echo -e "${YELLOW}⚠️  Git pull failed or no changes available${NC}"
        echo -e "${YELLOW}   Continuing with current code...${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Not a git repository, skipping code update${NC}"
    echo -e "${YELLOW}   Continuing with current code...${NC}"
fi

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
$COMPOSE_CMD down 2>/dev/null || true

# Remove old images to force rebuild
echo -e "${BLUE}🗑️  Removing old images...${NC}"
$COMPOSE_CMD down --rmi all 2>/dev/null || true

# Build and start services
echo -e "${BLUE}🔨 Building and starting services...${NC}"
$COMPOSE_CMD up --build -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 30

# Check service health
echo -e "${BLUE}🏥 Checking service health...${NC}"

# Check if the API is responding
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API is healthy and responding${NC}"
else
    echo -e "${RED}❌ API health check failed${NC}"
    echo -e "${YELLOW}📋 Checking logs...${NC}"
    $COMPOSE_CMD logs app
    exit 1
fi

# Check MongoDB (external)
echo -e "${BLUE}🏥 Checking external MongoDB connection...${NC}"
if nc -z localhost 27017 2>/dev/null; then
    echo -e "${GREEN}✅ External MongoDB is accessible on port 27017${NC}"
else
    echo -e "${YELLOW}⚠️  External MongoDB not accessible on port 27017${NC}"
    echo -e "${YELLOW}   Make sure your MongoDB is running and accessible${NC}"
fi

# Check Redis
if $COMPOSE_CMD exec redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is healthy${NC}"
else
    echo -e "${RED}❌ Redis health check failed${NC}"
fi

# Display service information
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "================================================"
echo -e "${BLUE}📊 Service Information:${NC}"
echo "  • API: http://localhost:3000"
echo "  • MongoDB: localhost:27017 (external)"
echo "  • Redis: localhost:6379"
echo "  • Nginx: http://localhost:80"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "  • View logs: $COMPOSE_CMD logs -f"
echo "  • Stop services: $COMPOSE_CMD down"
echo "  • Restart services: $COMPOSE_CMD restart"
echo "  • Update services: $COMPOSE_CMD pull && $COMPOSE_CMD up -d"
echo "  • Deploy with latest code: ./deploy-homelab.sh"
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "  • Check status: $COMPOSE_CMD ps"
echo "  • View API logs: $COMPOSE_CMD logs -f app"
echo "  • Access MongoDB: mongosh mongodb://localhost:27017/service-orders"
echo "  • Access Redis: $COMPOSE_CMD exec redis redis-cli"
echo ""
echo -e "${YELLOW}⚠️  Security Notes:${NC}"
echo "  • Change default passwords in production"
echo "  • Configure SSL certificates for HTTPS"
echo "  • Set up proper firewall rules"
echo "  • Regular backups of MongoDB data"
echo ""
echo -e "${GREEN}🚀 Your Service Orders API is now running in your homelab!${NC}"
