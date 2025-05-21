#!/usr/bin/env pwsh

# Check if container already exists and remove it if it does
$containerExists = docker ps -a --filter "name=open-resume-container" --format "{{.Names}}"
if ($containerExists -eq "open-resume-container") {
    Write-Host "Container already exists. Stopping and removing it..."
    docker stop open-resume-container
    docker rm open-resume-container
}

# Build the Docker image
Write-Host "Building Docker image..."
docker build -t open-resume .

# Run the container
Write-Host "Running Docker container..."
docker run -p 3000:3000 --name open-resume-container open-resume

# Instructions for later cleanup
Write-Host ""
Write-Host "To stop and remove the container later:"
Write-Host "docker stop open-resume-container"
Write-Host "docker rm open-resume-container"
