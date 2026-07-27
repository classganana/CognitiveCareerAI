#!/usr/bin/env bash
set -euo pipefail

# Run once on a fresh Amazon Linux 2023 EC2 instance (as ec2-user with sudo).

sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-aarch64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

sudo mkdir -p /opt/career-case-management
sudo chown "$USER:$USER" /opt/career-case-management

echo "Docker bootstrap complete. Log out and back in, then verify:"
echo "  docker --version"
echo "  docker compose version"
