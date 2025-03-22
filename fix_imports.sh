#!/bin/bash

# Fix imports in all TypeScript files in the pages directory
find ./src/icp_ticket_dapp_frontend/src/pages -name "*.tsx" -type f -exec sed -i 's/from "declarations\/icp_ticket_dapp_backend"/from "..\/..\/..\/declarations\/icp_ticket_dapp_backend"/g' {} \;

echo "Import paths fixed in all page files." 