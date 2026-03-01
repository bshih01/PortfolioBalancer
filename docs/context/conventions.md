# Conventions

## Python
- snake_case for functions, variables, files
- Type hints on function signatures
- `venv` + `requirements.txt` for dependency management
- Keep functions short — if it scrolls, break it up

## React / JS
- camelCase for variables and functions, PascalCase for components
- Functional components only, hooks for state
- Vite for build tooling, npm for packages

## General
- No premature abstractions — wait until something is used 3+ times
- Secrets in `.env`, never committed
- Prefer flat file structures over deep nesting
- Keep files focused — one responsibility per file
