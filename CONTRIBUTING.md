# Contributing to LEIC Tierlist Builder

Thank you for your interest in contributing to the LEIC Tierlist Builder! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** package manager

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

    ```bash
    git clone https://github.com/YOUR_USERNAME/LEIC-Tierlist-Builder.git
    cd LEIC-Tierlist-Builder
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Start the development server**:

    ```bash
    npm run dev
    ```

5. **Open the application** in your browser at `http://localhost:5173/LEIC-Tierlist-Builder/`

## 🛠️ Development Workflow

### Project Structure

```plaintext
LEIC-Tierlist-Builder/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable Vue components
│   ├── views/          # Page-level Vue components
│   ├── router/         # Vue Router configuration
│   ├── styles/         # CSS styles (organized by category)
│   ├── App.vue         # Root Vue component
│   └── main.js         # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

### Pre-commit Hooks

This project uses **Husky** and **lint-staged** to automatically run code quality checks before each commit:

- **ESLint** checks and fixes code quality issues
- **Prettier** formats code consistently
- **Commits are blocked** if there are unfixable linting errors

The hooks run automatically - no manual intervention needed!

### Code Style Guidelines

This project uses **ESLint** and **Prettier** for consistent code formatting:

- **Indentation**: Tabs (4 spaces width)
- **Quotes**: Single quotes
- **Semicolons**: Not required
- **Line length**: Max 120 characters
- **Component naming**: Use PascalCase for Vue components

### Vue.js Specific Guidelines

- Use **Vue 3 Composition API** for new components
- Follow **Vue.js style guide** conventions
- Use **PascalCase** for component names
- Use **kebab-case** for prop names and events
- Keep components focused and reusable

## 📝 Making Changes

### Branch Naming Convention

Create descriptive branch names:

- `feature/add-course-search` - for new features
- `fix/tierlist-drag-bug` - for bug fixes
- `docs/update-readme` - for documentation updates
- `style/improve-mobile-layout` - for UI/styling changes

### Commit Messages

Write clear, concise commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when applicable

Examples:

```plaintext
Add drag and drop functionality for tierlist items

Fix responsive layout on mobile devices

Update course data with 2024/2025 curriculum
```

### Testing Your Changes

1. **Run the development server** and test your changes locally
2. **Check for console errors** in browser dev tools
3. **Test on different screen sizes** for responsive design
4. **Verify functionality** works as expected
5. **Run linting** to ensure code quality

## 🐛 Reporting Issues

When reporting bugs or requesting features:

1. **Search existing issues** to avoid duplicates
2. **Provide clear reproduction steps** for bugs
3. **Include screenshots** for UI-related issues
4. **Specify browser and device** information

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Test thoroughly** and ensure code quality
4. **Update documentation** if needed
5. **Submit a pull request** with:
    - Clear title and description
    - Reference to related issues
    - Screenshots for UI changes
    - Testing notes

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Code is properly formatted (`npm run format`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Changes are documented
- [ ] UI changes are responsive
- [ ] Commit messages are clear

## 🎯 Areas for Contribution

We welcome contributions in these areas:

- **New Features**: Course search, filtering, export functionality
- **UI/UX Improvements**: Better responsive design, accessibility
- **Performance**: Optimization and loading improvements
- **Documentation**: Code comments, user guides, tutorials
- **Bug Fixes**: Resolving reported issues
- **Testing**: Adding unit and integration tests

## 📚 Resources

### Vue.js Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)

### Development Tools

- [Vite Documentation](https://vitejs.dev/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

## 🤝 Community

- Be respectful and inclusive in all interactions
- Help newcomers get started
- Provide constructive feedback in code reviews
- Follow the project's code of conduct

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to LEIC Tierlist Builder!** 🎓✨

For questions, feel free to reach out to me.
