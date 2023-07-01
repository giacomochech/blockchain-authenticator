Start-Process powershell -NoNewWindow -ArgumentList "-NoExit", "-Command", `
    "& '..\..\.venv\Scripts\Activate.ps1'; cd .\client\; npm start"

Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "& '..\..\.venv\Scripts\Activate.ps1'; cd .\truffle\; npx ganache-cli -m 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'"

Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "& '..\..\.venv\Scripts\Activate.ps1'; cd .\truffle\; npx truffle migrate --reset --network development"