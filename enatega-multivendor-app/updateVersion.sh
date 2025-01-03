#!/bin/bash

# Function to read the current version from app.json
read_app_json() {
  local version
  version=$(jq -r '.expo.version' app.json)
  if [ -z "$version" ]; then
    echo "Error reading app.json"
    exit 1
  fi
  echo "$version"
}

# Function to update the app version via GraphQL mutation
update_version() {
  local version="$1"
  # local url="http://10.97.22.208:8001/graphql"
  local url="https://yalla-api.up.railway.app/graphql"

  # Define the GraphQL mutation as a JSON payload
  local payload=$(jq -n \
    --arg version "$version" \
    '{query: "mutation SetVersions($customerAppVersion: String!) { setVersions(customerAppVersion: $customerAppVersion) }", variables: {customerAppVersion: $version}}')

  # Send the request and capture the response
  local response
  response=$(curl -s -X POST "$url" -H "Content-Type: application/json" -d "$payload")

  # Print the server response for debugging
  echo "Response from server: $response"

  # Check if the response indicates success
  local success
  success=$(echo "$response" | jq -r '.data.setVersions')

  if [ "$success" == "null" ]; then
    echo "Error updating version on the server: $(echo "$response" | jq -r '.errors')"
    exit 1
  fi

  echo "Customer app version updated successfully on the server."
}


# Function to run a command and check its success
run_command() {
  local command="$1"
  echo "Executing command: $command"
  eval "$command"
  if [ $? -ne 0 ]; then
    echo "Error executing command '$command'"
    exit 1
  fi
}

# Function to check if already logged in to EAS
check_eas_login() {
  if eas whoami > /dev/null 2>&1; then
    echo "Already logged in to EAS."
    return 0
  else
    echo "Not logged in to EAS. Logging in..."
    return 1
  fi
}

# Main function
main() {
  local version

  # Read the current version from app.json
  version=$(read_app_json)
  echo "Current version in app.json: $version"

  # Update the version on the server
  update_version "$version"

  # Check login status
  if ! check_eas_login; then
    run_command "eas login"
  fi

  # Run build configuration
  run_command "eas build:configure"

  # Get platform and profile from user
  read -p "Enter build platform (ios/android/all): " platform
  case "$platform" in
    ios|android|all) ;;
    *)
      echo "Invalid platform. Please choose 'ios', 'android', or 'all'."
      exit 1
      ;;
  esac

  read -p "Enter build profile (production/development/staging): " profile
  case "$profile" in
    production|development|staging) ;;
    *)
      echo "Invalid profile. Please choose 'production', 'development', or 'staging'."
      exit 1
      ;;
  esac

  # Run the build command
  run_command "eas build --platform $platform --profile $profile"
  echo "Build process completed successfully."
}

# Execute the main function
main
