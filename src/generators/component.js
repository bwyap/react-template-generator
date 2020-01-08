"use strict";

const loadUtils = require("../utils");

/**
 * Create the config for generating a React component in a module.
 */
const generateComponentConfig = config => {
  const { projectPath, templatePath, componentExistsIn } = loadUtils(config);
  const { basePath, componentPaths, componentNames } = config;

  const componentPath = path =>
    projectPath(
      `${basePath}/${componentPaths.component}/${componentNames.component}/${path}`
    );

  return {
    description: "Add a component to a module",
    prompts: [
      {
        type: "input",
        name: "module",
        message:
          "What module should the component be created in? (If the module does not exist, it will be created)",
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
        message: "What should the component be called?",
        validate: value => {
          if (!/.+/.test(value)) {
            return "A name is required.";
          }

          const module = componentExistsIn(value);
          if (module) {
            return `A component with this name already exists in the module "${module}".`;
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
          path: componentPath("index.ts"),
          templateFile: templatePath("component/index.ts.hbs"),
          abortOnFail: true
        },
        // Create the source file
        {
          type: "add",
          path: componentPath("{{ properCase name }}.tsx"),
          templateFile: templatePath("component/source.tsx.hbs"),
          abortOnFail: true
        },
        // Create types file
        {
          type: "add",
          path: componentPath("types.d.ts"),
          templateFile: templatePath("component/types.d.ts.hbs"),
          abortOnFail: true
        },
        // Create the styles file
        {
          type: "add",
          path: componentPath("styles.ts"),
          templateFile: templatePath("component/styles.ts.hbs"),
          abortOnFail: true
        }
      ];

      return actions;
    }
  };
};

module.exports = { generateComponentConfig };
