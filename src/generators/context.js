"use strict";

const loadUtils = require("../utils");

/**
 * Create the config for generating a React context in a module.
 */
const generateContextConfig = config => {
  const { projectPath, templatePath, contextExistsIn } = loadUtils(config);
  const { basePath, componentPaths, componentNames } = config;

  const contextPath = path =>
    projectPath(
      `${basePath}/${componentPaths.context}/${componentNames.context}/${path}`
    );

  return {
    description: "Add a context to a module",
    prompts: [
      {
        type: "input",
        name: "module",
        message:
          "What module should the context be created in? (If the module does not exist, it will be created)",
        default: "core",
        validate: value => {
          if (!/.+/.test(value)) {
            return "A module is required.";
          }
          return true;
        }
      },
      {
        type: "input",
        name: "name",
        message:
          "What should the context be called? ('Context' will be appended to the name)",
        validate: value => {
          if (!/.+/.test(value)) {
            return "A name is required.";
          }

          if (/Context/.test(value)) {
            return 'Do not use "Context" in the name.';
          }

          const mod = contextExistsIn(`${value}Context`);
          if (mod) {
            return `A context with this name already exists in the module "${mod}".`;
          }

          return true;
        }
      }
    ],

    actions: data => {
      // Generate files
      const actions = [
        // Create the index file
        {
          type: "add",
          path: contextPath("index.ts"),
          templateFile: templatePath("context/index.ts.hbs"),
          abortOnFail: true
        },
        // Create the provder file
        {
          type: "add",
          path: contextPath("{{ properCase name }}Provider.tsx"),
          templateFile: templatePath("context/provider.tsx.hbs"),
          abortOnFail: true
        },
        // Create types file
        {
          type: "add",
          path: contextPath("types.d.ts"),
          templateFile: templatePath("context/types.d.ts.hbs"),
          abortOnFail: true
        }
      ];

      return actions;
    }
  };
};

module.exports = { generateContextConfig };
